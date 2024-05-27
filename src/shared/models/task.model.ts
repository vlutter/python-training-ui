export type TaskTest = {
    input_data: string;
    output_data: string;
}

export type TaskBrief = {
    id: string;
    name: string;
    status?: TaskStatus;
}

export type TaskBriefWithSolution = TaskBrief & {
    solution?: string;
    output?: TaskSolutionOutput;
}

export type Task = TaskBrief & {
    group_id: number;
    description: string;
    tests: TaskTest[];
    last_solution?: string;
}

export enum TaskStatus {
    NotStarted = 'not_started',
    InProgress = 'in_progress',
    Done = 'done',
}

export type TaskGroup = {
    id: number;
    name: string;
    tasks: TaskBrief[];
    status?: TaskStatus;
}

export type TaskGroupWithSolutions = {
    id: number;
    name: string;
    tasks: TaskBriefWithSolution[];
    status?: TaskStatus;
}

export type TaskSolution = {
    user_id: number;
    name: string;
    email: string;
    status: TaskStatus;
    solution: string;
    output?: TaskSolutionOutput;
}

export type TaskSolutionOutput = {
    output_data?: string;
    error?: string;
    data?: any
}