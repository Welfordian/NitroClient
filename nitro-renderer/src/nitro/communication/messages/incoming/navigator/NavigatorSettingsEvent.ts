import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { NavigatorSettingsParser } from '../../parser/navigator/NavigatorSettingsParser';

export class NavigatorSettingsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, NavigatorSettingsParser);
    }

    public getParser(): NavigatorSettingsParser
    {
        return this.parser as NavigatorSettingsParser;
    }
}
