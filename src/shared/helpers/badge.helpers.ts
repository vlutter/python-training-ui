import { TaskStatus } from "@models/task.model";
import { TuiStatus } from "@taiga-ui/kit";

export type StatusBadgeConfig = {
    status: TuiStatus;
    text: string,
    icon?: string
}

export const getBadgeByStatus = (status?: TaskStatus): StatusBadgeConfig =>  {
    if (status === TaskStatus.InProgress) {
        return { status: 'info', text: 'В процессе', icon: 'tuiIconClock'}
    }

    if (status === TaskStatus.Done) {
        return { status: 'success', text: 'Решено', icon: 'tuiIconCheck'}
    }

    return { status: 'neutral', text: 'Не начато'}
}