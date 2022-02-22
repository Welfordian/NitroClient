﻿import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_9021 } from '../../../parser/inventory/clothing/_Str_9021';

export class _Str_17532 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_9021);
    }

    public getParser(): _Str_9021
    {
        return this.parser as _Str_9021;
    }
}
