import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { CatalogPublishedMessageParser } from '../../parser/catalog/CatalogPublishedMessageParser';

export class CatalogPublishedMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, CatalogPublishedMessageParser);
    }

    public getParser(): CatalogPublishedMessageParser
    {
        return this.parser as CatalogPublishedMessageParser;
    }
}
