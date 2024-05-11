export type TaskBrief = {
    id: number;
    name: string;
}

export type Task = TaskBrief & {
    group_id: number;
    description: string;
    example_data: string;
}

export type TaskGroup = {
    id: number;
    name: string;
    tasks: TaskBrief[];
}