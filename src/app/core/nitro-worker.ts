/// <reference lib="webworker" />

const intervals: {
    id: number,
    interval: ReturnType<typeof setInterval>
}[] = [];

self.addEventListener('message', (message: MessageEvent) =>
{
    if(!message) return;

    const data: { [index: string]: any } = message.data;

    switch(data.type)
    {
        case 'CREATE_INTERVAL': {
            const id        = (data.timerId as number);
            const time      = (data.time as number);
            const response  = (data.response as string);

            const interval = setInterval(() => self.postMessage(response), time);

            intervals.push({ id, interval });
            return;
        }
        case 'REMOVE_INTERVAL': {
            const id = (data.timerId as number);

            const i = 0;

            while(i < intervals.length)
            {
                const interval = intervals[i];

                if(interval.id === id)
                {
                    clearInterval(interval.interval);

                    intervals.splice(i, 1);

                    return;
                }
            }
        }
    }
});
