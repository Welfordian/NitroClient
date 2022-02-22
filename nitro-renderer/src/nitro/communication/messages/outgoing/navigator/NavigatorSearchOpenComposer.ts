import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class NavigatorSearchOpenComposer implements IMessageComposer<ConstructorParameters<typeof NavigatorSearchOpenComposer>>
{
    private _data: ConstructorParameters<typeof NavigatorSearchOpenComposer>;

    constructor(code: string)
    {
        this._data = [ code ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}