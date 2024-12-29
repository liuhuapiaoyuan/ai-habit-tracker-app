'use client';
import { v4 as uuidv4 } from 'uuid';
import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { AppState, AppAction, TaskCompletion } from '@/types/state';
import { achievements as achievementConfigs } from '@/config/achievements';
import { SyncInterface } from './sync/SyncInterface';
import { LocalStorageSync } from './sync/LocalStorageSync';

const initialState: AppState = {
  tasks: [],
  completions: [],
  achievements: {
    unlocked: [],
    new: null
  }
};

// 创建同步实例
export const syncService: SyncInterface = new LocalStorageSync();

// 定义状态同步函数
const syncTasks = async (tasks: AppState['tasks']) => {
  await syncService.saveTasks(tasks);
};

const syncCompletions = async (completions: AppState['completions']) => {
  await syncService.saveCompletions(completions);
};

const syncAchievements = async (achievements: AppState['achievements']['unlocked']) => {
  await syncService.saveAchievements(achievements);
};

function appReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState;
  
  switch (action.type) {
    case 'SET_TASKS':
      newState = { ...state, tasks: action.payload };
      syncTasks(action.payload);
      return newState;
    
    case 'ADD_TASKS':
      newState = { ...state, tasks: [...state.tasks, ...action.payload] };
      syncTasks(newState.tasks);
      return newState;

    case 'UPDATE_TASK':
      const { id, task } = action.payload;
      const newTasks = state.tasks.map(t => t.id === id ? Object.assign({}, t, task) : t);
      newState = { ...state, tasks: newTasks };
      syncTasks(newTasks);
      return newState;
    
    case 'COMPLETE_TASK': {
      const task = state.tasks.find(t => t.id === action.payload);
      if(!task){
        return state
      }
      // 先判断今日是否已经完成
      const today = new Date().toISOString().split('T')[0];
      const alreadyCompletedToday = state.completions.some(
        completion => completion.taskId === action.payload && completion.completedAt.startsWith(today)
      );
      
      if (alreadyCompletedToday) {
        return state;
      }

      const newCompletion: TaskCompletion = {
        id: uuidv4(),
        taskId: action.payload,
        reward: task?.reward || 0,
        completedAt: new Date().toISOString()
      }


      const newCompletions = [...state.completions, newCompletion];
      // 检查成就
      const currentlyValid = new Set(
        achievementConfigs
          .filter(achievement => achievement.condition(state.tasks, newCompletions))
          .map(achievement => achievement.id)
      );

      const currentlyUnlocked = new Set(state.achievements.unlocked.map(a => a.id));
      const toUnlock = achievementConfigs.find(achievement => 
        !currentlyUnlocked.has(achievement.id) && currentlyValid.has(achievement.id)
      );

      newState = {
        ...state,
        completions: newCompletions,
        achievements: {
          unlocked: toUnlock 
            ? [...state.achievements.unlocked, {
                id: toUnlock.id,
                completedTime: new Date().toISOString(),
                completionId: newCompletion.id
              }]
            : state.achievements.unlocked,
          new: toUnlock || null
        }
      };
      
      syncCompletions(newCompletions);
      if (toUnlock) {
        syncAchievements(newState.achievements.unlocked);
      }
      return newState;
    }
    
    case 'UNCOMPLETE_TASK': {
      const newCompletions = state.completions.filter(
        completion => completion.taskId !== action.payload
      );
      // 删除所有与该任务相关的成就
      const newUnlocked = state.achievements.unlocked.filter(
        a => newCompletions.some(c => c.id === a.completionId)
      )
      console.log('newUnlocked',newUnlocked)
      newState = { ...state, completions: newCompletions, achievements: { ...state.achievements, unlocked: newUnlocked } };
      syncCompletions(newCompletions);
      syncAchievements(newUnlocked);
      return newState;
    }
    
    case 'SET_COMPLETIONS':
      newState = { ...state, completions: action.payload };
      syncCompletions(action.payload);
      return newState;
    
    case 'SET_ACHIEVEMENTS':
      newState = {
        ...state,
        achievements: { ...state.achievements, unlocked: action.payload }
      };
      syncAchievements(action.payload);
      return newState;
    
    case 'SET_NEW_ACHIEVEMENT':
      return {
        ...state,
        achievements: { ...state.achievements, new: action.payload }
      };
    
    case 'DELETE_TASK': {
      const newTasks = state.tasks.filter(task => task.id !== action.payload);
      newState = { ...state, tasks: newTasks };
      syncTasks(newTasks);
      return newState;
    }

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setTasks: (tasks: AppState['tasks']) => void;
  addTasks: (tasks: AppState['tasks']) => void;
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  setCompletions: (completions: AppState['completions']) => void;
  setAchievements: (achievements: AppState['achievements']['unlocked']) => void;
  setNewAchievement: (achievement: AppState['achievements']['new']) => void;
  updateTask: (id: string, task: AppState['tasks'][number]) => void;
  deleteTask: (id: string) => void;
  init: () => void;
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初始加载数据
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [tasks, completions, achievements] = await Promise.all([
          syncService.loadTasks(),
          syncService.loadCompletions(),
          syncService.loadAchievements()
        ]);

        dispatch({ type: 'SET_TASKS', payload: tasks });
        dispatch({ type: 'SET_COMPLETIONS', payload: completions });
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);
  const init = useCallback(async () => {
    
    try {
      const [tasks, completions, achievements] = await Promise.all([
        syncService.loadTasks(),
        syncService.loadCompletions(),
        syncService.loadAchievements()
      ]);

      dispatch({ type: 'SET_TASKS', payload: tasks });
      dispatch({ type: 'SET_COMPLETIONS', payload: completions });
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  
  }, [dispatch]);
  const setTasks = useCallback((tasks: AppState['tasks']) => 
    dispatch({ type: 'SET_TASKS', payload: tasks }), []);
  
  const addTasks = useCallback((tasks: AppState['tasks']) => 
    dispatch({ type: 'ADD_TASKS', payload: tasks }), []);
  
  const completeTask = useCallback((taskId: string) => 
    dispatch({ type: 'COMPLETE_TASK', payload: taskId }), []);
  
  const uncompleteTask = useCallback((taskId: string) => 
    dispatch({ type: 'UNCOMPLETE_TASK', payload: taskId }), []);
  
  const setCompletions = useCallback((completions: AppState['completions']) => 
    dispatch({ type: 'SET_COMPLETIONS', payload: completions }), []);
  
  const setAchievements = useCallback((achievements: AppState['achievements']['unlocked']) => 
    dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements }), []);
  
  const setNewAchievement = useCallback((achievement: AppState['achievements']['new']) => 
    dispatch({ type: 'SET_NEW_ACHIEVEMENT', payload: achievement }), []);
  
  const updateTask = useCallback((id: string, task: AppState['tasks'][number]) => 
    dispatch({ type: 'UPDATE_TASK', payload: { id, task } }), []);
  
  const deleteTask = useCallback((id: string) => 
    dispatch({ type: 'DELETE_TASK', payload: id }), []);

  return (
    <AppContext.Provider value={{
      dispatch,
      state,
      setTasks,
      addTasks,
      completeTask,
      uncompleteTask,
      setCompletions,
      setAchievements,
      setNewAchievement,
      updateTask,
      deleteTask,
      init
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
 