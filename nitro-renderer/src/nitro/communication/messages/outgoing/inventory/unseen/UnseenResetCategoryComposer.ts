import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class UnseenResetCategoryComposer implements IMessageComposer<ConstructorParameters<typeof UnseenResetCategoryComposer>>
{
    private _data: ConstructorParameters<typeof UnseenResetCategoryComposer>;

    constructor(category: number)
    {
        this._data = [ category ];
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
