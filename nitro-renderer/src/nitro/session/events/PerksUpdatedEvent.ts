﻿import { NitroEvent } from '../../../core/events/NitroEvent';

export class PerksUpdatedEvent extends NitroEvent
{
    public static PERKS_UPDATED: string = 'PUE_perks_updated';

    constructor()
    {
        super(PerksUpdatedEvent.PERKS_UPDATED);
    }
}