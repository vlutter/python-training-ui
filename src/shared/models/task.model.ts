export type TaskTest = {
    input_data: string;
    output_data: string;
}

export type TaskBrief = {
    id: string;
    name: string;
}

export type Task = TaskBrief & {
    group_id: number;
    description: string;
    tests: TaskTest[];
}

export type TaskGroup = {
    id: number;
    name: string;
    tasks: TaskBrief[];
}