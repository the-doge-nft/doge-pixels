import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import  { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import {ConfigService} from "@nestjs/config";
import {Configuration} from "../config/configuration";


@Injectable()
export class DiscordService implements OnModuleInit {
    private readonly logger = new Logger(DiscordService.name)
    private client: Client

    constructor(
        private config: ConfigService<Configuration>
    ) {}

    onModuleInit() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages
            ]
        })
        this.client.login(this.config.get("discord").secret)
        this.client.once("ready", () => {
            this.logger.log('discord bot is ready')
        })
    }
}
