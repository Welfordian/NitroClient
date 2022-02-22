import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class CancelQuestMessageComposer implements IMessageComposer<ConstructorParameters<typeof CancelQuestMessageComposer>>
{
  private _data: ConstructorParameters<typeof CancelQuestMessageComposer>;

  constructor()
  {
      this._data = [];
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
