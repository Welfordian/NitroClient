import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { CallForHelpCategoryData, CfhTopicsInitEvent, ChatRecordData, GetModeratorRoomInfoMessageComposer, GetRoomChatlogMessageComposer, IMessageEvent, ModeratorInitData, ModeratorInitMessageEvent, ModeratorRoomInfoEvent, ModeratorRoomInfoMessageParser, Nitro, RoomChatlogEvent, RoomEntryInfoMessageEvent, RoomEntryInfoMessageParser, RoomVisitsData, RoomVisitsEvent, UserChatlogEvent, UserInfoEvent } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../notification/services/notification.service';
import { ModToolMainComponent } from '../components/main/main.component';
import { UserToolUser } from '../components/user/user-tool/user-tool-user';

@Injectable()
export class ModToolService implements OnDestroy
{
    private _component: ModToolMainComponent;
    private _messages: IMessageEvent[];


    private _users: UserToolUser[] = [];
    private _roomVisits: ChatRecordData[];
    private _callForHelpCategories: CallForHelpCategoryData[];

    private _currentSelectedUser: UserToolUser = null;

    private _showModActionOnUser: boolean = false;
    private _showVisitedRoomsForUser: boolean = false;
    private _showSendUserMessage: boolean = false;
    private _showSendUserChatlogs: boolean = false;
    private _showRoomTools: boolean = false;
    private _showRoomChatLogs: boolean = false;



    private _Str_20687: ModeratorInitData = null;
    private _userRoomVisitedData: RoomVisitsData;
    private _currentRoomInfo: RoomEntryInfoMessageParser;
    private _modToolRoomInfo: ModeratorRoomInfoMessageParser;
    private _userChatlogs: ChatRecordData;

    constructor(
        private _notificationService: NotificationService,
        private _ngZone: NgZone)
    {
        this._component = null;

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        if(this._messages) this.unregisterMessages();

        this._messages = [
            new ModeratorRoomInfoEvent(this.onRoomInfoEvent.bind(this)),
            new UserInfoEvent(this.onUserInfoEvent.bind(this)),
            new UserChatlogEvent(this.onModtoolUserChatlogEvent.bind(this)),
            new RoomChatlogEvent(this.onModtoolRoomChatlogEvent.bind(this)),
            new CfhTopicsInitEvent(this.onModToolsCFHCategoriesEvent.bind(this)),
            new ModeratorInitMessageEvent(this.onModtoolsMainEvent.bind(this)),
            new RoomVisitsEvent(this.onRoomsReceivedForUserEvent.bind(this)),
            new RoomEntryInfoMessageEvent(this.onRoomInfoOwnerEvent.bind(this)),
        ];

        for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        if(this._messages && this._messages.length)
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);
        }
    }

    public get component(): ModToolMainComponent
    {
        return this._component;
    }

    public set component(component: ModToolMainComponent)
    {
        this._component = component;
    }

    private onModtoolsMainEvent(event: ModeratorInitMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._Str_20687 = parser.data;
    }

    private onRoomInfoOwnerEvent(event: RoomEntryInfoMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._currentRoomInfo = parser;
    }

    private onRoomsReceivedForUserEvent(event: RoomVisitsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this._userRoomVisitedData = parser.data);
    }

    private onModToolsCFHCategoriesEvent(event: CfhTopicsInitEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._callForHelpCategories = parser.callForHelpCategories;
    }

    private onRoomInfoEvent(event: ModeratorRoomInfoEvent): void
    {
        if(!Nitro.instance.sessionDataManager.isModerator) return;

        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;


        this._ngZone.run(() =>
        {
            this._modToolRoomInfo = parser;
        });

    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        const userInfo = event.getParser().userInfo;
        this._ngZone.run(() =>
        {
            this._users.push(new UserToolUser(userInfo.userId, userInfo.username));
        });
    }

    private onModtoolUserChatlogEvent(event: UserChatlogEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._roomVisits = parser.data.roomChatlogs;
        });
    }

    private onModtoolRoomChatlogEvent(event: RoomChatlogEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._userChatlogs = parser.data;
        });
    }

    public openRoomTool(roomId: number = null): void
    {
        if(!this._currentRoomInfo) return;

        this._modToolRoomInfo = null;
        Nitro.instance.communication.connection.send(new GetModeratorRoomInfoMessageComposer((roomId ? roomId : this._currentRoomInfo.roomId)));
        this._showRoomTools = true;
    }

    public openChatlogTool(): void
    {
        this._modToolRoomInfo = null;
        Nitro.instance.communication.connection.send(new GetModeratorRoomInfoMessageComposer(this._currentRoomInfo.roomId));
        Nitro.instance.communication.connection.send(new GetRoomChatlogMessageComposer(this._currentRoomInfo.roomId));
        this.showRoomChatLogs = true;
    }

    public closeUserTool(): void
    {
        if(!this._component) return;

        this._component.userToolVisible = false;
    }

    public closeRoomVisitedTool(): void
    {
        this._showVisitedRoomsForUser = false;
    }


    public get users(): UserToolUser[]
    {
        return this._users;
    }

    public get roomVisits(): ChatRecordData[]
    {
        return this._roomVisits;
    }

    public get userChatlogs(): ChatRecordData
    {
        return this._userChatlogs;
    }

    public selectUser(webID: number, name: string, figure: string = null, gender: string = null): void
    {
        this._currentSelectedUser = new UserToolUser(webID, name, figure, gender);
    }

    public get selectedUser(): UserToolUser
    {
        return this._currentSelectedUser;
    }

    public get showModActionOnUser(): boolean
    {
        return this._showModActionOnUser;
    }

    public set showModActionOnUser(show: boolean)
    {
        this._showModActionOnUser = show;
    }

    public get showVisitedRoomsForUser(): boolean
    {
        return this._showVisitedRoomsForUser;
    }

    public set showVisitedRoomsForUser(show: boolean)
    {
        this._showVisitedRoomsForUser = show;
    }

    public get showSendUserMessage(): boolean
    {
        return this._showSendUserMessage;
    }

    public set showSendUserMessage(show: boolean)
    {
        this._showSendUserMessage = show;
    }

    public get showSendUserChatlogs(): boolean
    {
        return this._showSendUserChatlogs;
    }

    public set showSendUserChatlogs(show: boolean)
    {
        this._showSendUserChatlogs = show;
    }

    public get showRoomTools(): boolean
    {
        return this._showRoomTools;
    }

    public set showRoomTools(show: boolean)
    {
        this._showRoomTools = show;
    }

    public get showRoomChatLogs(): boolean
    {
        return this._showRoomChatLogs;
    }

    public set showRoomChatLogs(show: boolean)
    {
        this._showRoomChatLogs = show;
    }

    public get callForHelpCategories(): CallForHelpCategoryData[]
    {
        return this._callForHelpCategories;
    }

    public get _Str_3325(): ModeratorInitData
    {
        return this._Str_20687;
    }

    public get roomUserVisitedData(): RoomVisitsData
    {
        return this._userRoomVisitedData;
    }

    public get currentRoom(): RoomEntryInfoMessageParser
    {
        return this._currentRoomInfo;
    }

    public get currentRoomModData(): ModeratorRoomInfoMessageParser
    {
        return this._modToolRoomInfo;
    }
}
