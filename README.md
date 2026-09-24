# APEX Discord Bot

A production-ready starter bot for Discord.js v14.

## Features
- Slash commands
- Permission/role checks
- Persistent SQLite database
- Persistent ticket panels
- Ticket buttons and category select menu
- Ticket close/claim/add-user controls
- Moderation commands
- Embeds
- Central configuration
- PostgreSQL-ready repository separation

## Install
1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Add your Discord bot token, application ID and test guild ID.
4. Run `npm install`.
5. Run `npm run deploy`.
6. Run `npm start`.

Enable the required privileged intents in the Discord Developer Portal only if you add features that need them. APEX uses guild interactions plus Message Content, Guild Members, Guild Message Reactions, Voice States, and Direct Messages for moderation, logging, reaction roles, and DM ticket relay.

## Branding
Change BOT_NAME and PRIMARY_COLOR in `.env`. Put your own branding files in `assets/`:
- bot-avatar.png
- bot-banner.png
- logo.png

Discord's actual application avatar/banner are changed in the Developer Portal; the bot uses the configured branding in its embeds and UI.

## Commands
- `/help`
- `/ping`
- `/serverinfo`
- `/userinfo`
- `/dm` (staff-only personal DM)
- `/clear`
- `/ban`
- `/kick`
- `/timeout`
- `/warn`
- `/warnings`
- `/ticket panel`
- `/ticket close`
- `/ticket claim`
- `/ticket add`
- `/ticket remove`

## Production notes
Use a process manager such as PM2 on a VPS. Back up `data/apex.sqlite`.

## APEX v1.1 additions
- Auto-moderation: blocked phrases, mention spam, excessive caps and repeated-message spam.
- Reaction roles: `/reactionrole add|remove|list` with persistent SQLite mappings.
- Staff management: `/staff note`, `/staff strike`, `/staff history`.
- Forms: `/forms panel` for staff applications, player reports, ban appeals and business applications.
- Comprehensive logs: commands, joins/leaves, message edits/deletions, bans/unbans, voice activity, AutoMod, tickets, forms, staff actions and reaction-role changes.

### Required Discord Developer Portal intents
Enable **Server Members Intent**, **Message Content Intent**, and **Message Reaction Intent** because APEX uses member management, AutoMod/message logging, and reaction roles.

### Log channel
Set `LOG_CHANNEL_ID` in `.env`. All supported APEX events are sent there. Keep the channel private to your staff team.


## APEX DM & Ticket DM Relay
APEX now supports a two-way personal-DM ticket workflow:

1. A user opens a ticket in Discord.
2. APEX sends the user a DM confirming the ticket.
3. Staff replies in the ticket channel.
4. APEX forwards the staff reply to the user's personal DM.
5. The user replies directly to the APEX DM.
6. APEX forwards that DM back into the user's open ticket channel.
7. Attachments are forwarded as links in both directions when possible.
8. DM send/receive activity is logged in the configured log channel.

### Important
Users must allow DMs from the server for the relay to work. Staff replies are identified by the configured staff roles/permissions. APEX only relays messages for an open ticket belonging to that user.

Use `/dm` for a staff member to send a direct message to any user outside a ticket.


## Anti-Nuke & Quarantine
APEX monitors rapid channel deletions, role deletions, bans, kicks and webhook abuse through Discord audit logs. A suspected abusive actor can be automatically quarantined using `QUARANTINE_ROLE_ID`. Manual controls are `/quarantine user` and `/quarantine release`.

No Discord bot can honestly guarantee an absolutely unbypassable system: Discord permissions, the server owner's authority, bot role hierarchy, audit-log timing, outages and compromised credentials can limit prevention. Keep APEX's role above roles it must manage and avoid giving untrusted administrators equivalent authority.

## Invite / Welcome / Leave
Configure `WELCOME_CHANNEL_ID`, `LEAVE_CHANNEL_ID`, and `QUARANTINE_ROLE_ID`. APEX sends a welcome channel message, attempts an automatic welcome DM, tracks invite-use changes when available, and logs joins/leaves.
