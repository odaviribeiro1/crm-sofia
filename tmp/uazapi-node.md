# Content from https://unpkg.com/n8n-nodes-n8ntools-uazapi@1.0.5/dist/nodes/N8nToolsUazapi/N8nToolsUazapi.node.js

"use strict";
Object.defineProperty(exports, "\_\_esModule", { value: true });
exports.N8nToolsUazapi = void 0;
const n8n\_workflow\_1 = require("n8n-workflow");
class N8nToolsUazapi {
 constructor() {
 this.description = {
 displayName: 'N8N Tools - Uazapi',
 name: 'n8nToolsUazapi',
 icon: 'file:n8ntools-uazapi.svg',
 group: \['communication'\],
 version: 1,
 subtitle: '={{$parameter\["operation"\] + ": " + $parameter\["resource"\]}}',
 description: 'Complete Uazapi integration - Premium WhatsApp API with advanced messaging and automation',
 defaults: {
 name: 'N8N Tools - Uazapi',
 },
 inputs: \["main" /\* NodeConnectionType.Main \*/\],
 outputs: \["main" /\* NodeConnectionType.Main \*/\],
 credentials: \[\
 {\
 name: 'uazapiApi',\
 required: true,\
 },\
 \],
 properties: \[\
 {\
 displayName: 'Resource',\
 name: 'resource',\
 type: 'options',\
 noDataExpression: true,\
 options: \[\
 {\
 name: 'Message',\
 value: 'message',\
 description: 'Send and manage WhatsApp messages',\
 },\
 {\
 name: 'Media',\
 value: 'media',\
 description: 'Send images, documents, audio, and videos',\
 },\
 {\
 name: 'Contact',\
 value: 'contact',\
 description: 'Manage contacts and contact lists',\
 },\
 {\
 name: 'Group',\
 value: 'group',\
 description: 'Create and manage WhatsApp groups',\
 },\
 {\
 name: 'Instance',\
 value: 'instance',\
 description: 'Manage WhatsApp instance settings',\
 },\
 {\
 name: 'Webhook',\
 value: 'webhook',\
 description: 'Configure webhooks and event handlers',\
 },\
 \],\
 default: 'message',\
 },\
 // MESSAGE OPERATIONS\
 {\
 displayName: 'Operation',\
 name: 'operation',\
 type: 'options',\
 noDataExpression: true,\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 },\
 },\
 options: \[\
 {\
 name: 'Send Text',\
 value: 'sendText',\
 description: 'Send a text message',\
 action: 'Send text message',\
 },\
 {\
 name: 'Send Template',\
 value: 'sendTemplate',\
 description: 'Send a WhatsApp template message',\
 action: 'Send template message',\
 },\
 {\
 name: 'Send Quick Reply',\
 value: 'sendQuickReply',\
 description: 'Send message with quick reply buttons',\
 action: 'Send quick reply message',\
 },\
 {\
 name: 'Send List',\
 value: 'sendList',\
 description: 'Send interactive list message',\
 action: 'Send list message',\
 },\
 {\
 name: 'Send Location',\
 value: 'sendLocation',\
 description: 'Send location message',\
 action: 'Send location message',\
 },\
 {\
 name: 'Get Messages',\
 value: 'getMessages',\
 description: 'Get message history',\
 action: 'Get messages',\
 },\
 {\
 name: 'Mark as Read',\
 value: 'markAsRead',\
 description: 'Mark messages as read',\
 action: 'Mark as read',\
 },\
 \],\
 default: 'sendText',\
 },\
 // MEDIA OPERATIONS\
 {\
 displayName: 'Operation',\
 name: 'operation',\
 type: 'options',\
 noDataExpression: true,\
 displayOptions: {\
 show: {\
 resource: \['media'\],\
 },\
 },\
 options: \[\
 {\
 name: 'Send Image',\
 value: 'sendImage',\
 description: 'Send image with optional caption',\
 action: 'Send image',\
 },\
 {\
 name: 'Send Document',\
 value: 'sendDocument',\
 description: 'Send document file',\
 action: 'Send document',\
 },\
 {\
 name: 'Send Audio',\
 value: 'sendAudio',\
 description: 'Send audio message',\
 action: 'Send audio',\
 },\
 {\
 name: 'Send Video',\
 value: 'sendVideo',\
 description: 'Send video with optional caption',\
 action: 'Send video',\
 },\
 {\
 name: 'Send Sticker',\
 value: 'sendSticker',\
 description: 'Send sticker message',\
 action: 'Send sticker',\
 },\
 {\
 name: 'Upload Media',\
 value: 'uploadMedia',\
 description: 'Upload media file to server',\
 action: 'Upload media',\
 },\
 {\
 name: 'Get Media URL',\
 value: 'getMediaUrl',\
 description: 'Get download URL for media',\
 action: 'Get media URL',\
 },\
 \],\
 default: 'sendImage',\
 },\
 // CONTACT OPERATIONS\
 {\
 displayName: 'Operation',\
 name: 'operation',\
 type: 'options',\
 noDataExpression: true,\
 displayOptions: {\
 show: {\
 resource: \['contact'\],\
 },\
 },\
 options: \[\
 {\
 name: 'Send Contact',\
 value: 'sendContact',\
 description: 'Send contact information',\
 action: 'Send contact',\
 },\
 {\
 name: 'Get Contact Info',\
 value: 'getContactInfo',\
 description: 'Get contact information',\
 action: 'Get contact info',\
 },\
 {\
 name: 'Check Number',\
 value: 'checkNumber',\
 description: 'Check if number exists on WhatsApp',\
 action: 'Check number',\
 },\
 {\
 name: 'Get Profile Photo',\
 value: 'getProfilePhoto',\
 description: 'Get contact profile photo',\
 action: 'Get profile photo',\
 },\
 {\
 name: 'Block Contact',\
 value: 'blockContact',\
 description: 'Block a contact',\
 action: 'Block contact',\
 },\
 {\
 name: 'Unblock Contact',\
 value: 'unblockContact',\
 description: 'Unblock a contact',\
 action: 'Unblock contact',\
 },\
 \],\
 default: 'sendContact',\
 },\
 // GROUP OPERATIONS\
 {\
 displayName: 'Operation',\
 name: 'operation',\
 type: 'options',\
 noDataExpression: true,\
 displayOptions: {\
 show: {\
 resource: \['group'\],\
 },\
 },\
 options: \[\
 {\
 name: 'Create Group',\
 value: 'createGroup',\
 description: 'Create a new WhatsApp group',\
 action: 'Create group',\
 },\
 {\
 name: 'Get Group Info',\
 value: 'getGroupInfo',\
 description: 'Get group information',\
 action: 'Get group info',\
 },\
 {\
 name: 'Update Group',\
 value: 'updateGroup',\
 description: 'Update group settings',\
 action: 'Update group',\
 },\
 {\
 name: 'Add Participant',\
 value: 'addParticipant',\
 description: 'Add participant to group',\
 action: 'Add participant',\
 },\
 {\
 name: 'Remove Participant',\
 value: 'removeParticipant',\
 description: 'Remove participant from group',\
 action: 'Remove participant',\
 },\
 {\
 name: 'Promote Admin',\
 value: 'promoteAdmin',\
 description: 'Promote participant to admin',\
 action: 'Promote admin',\
 },\
 {\
 name: 'Demote Admin',\
 value: 'demoteAdmin',\
 description: 'Demote admin to participant',\
 action: 'Demote admin',\
 },\
 {\
 name: 'Leave Group',\
 value: 'leaveGroup',\
 description: 'Leave the group',\
 action: 'Leave group',\
 },\
 \],\
 default: 'createGroup',\
 },\
 // INSTANCE OPERATIONS\
 {\
 displayName: 'Operation',\
 name: 'operation',\
 type: 'options',\
 noDataExpression: true,\
 displayOptions: {\
 show: {\
 resource: \['instance'\],\
 },\
 },\
 options: \[\
 {\
 name: 'Get Status',\
 value: 'getStatus',\
 description: 'Get instance connection status',\
 action: 'Get status',\
 },\
 {\
 name: 'Get QR Code',\
 value: 'getQrCode',\
 description: 'Get QR code for connection',\
 action: 'Get QR code',\
 },\
 {\
 name: 'Restart Instance',\
 value: 'restartInstance',\
 description: 'Restart WhatsApp instance',\
 action: 'Restart instance',\
 },\
 {\
 name: 'Logout',\
 value: 'logout',\
 description: 'Logout from WhatsApp',\
 action: 'Logout',\
 },\
 {\
 name: 'Set Profile',\
 value: 'setProfile',\
 description: 'Update profile information',\
 action: 'Set profile',\
 },\
 {\
 name: 'Get Chats',\
 value: 'getChats',\
 description: 'Get all active chats',\
 action: 'Get chats',\
 },\
 \],\
 default: 'getStatus',\
 },\
 // WEBHOOK OPERATIONS\
 {\
 displayName: 'Operation',\
 name: 'operation',\
 type: 'options',\
 noDataExpression: true,\
 displayOptions: {\
 show: {\
 resource: \['webhook'\],\
 },\
 },\
 options: \[\
 {\
 name: 'Set Webhook',\
 value: 'setWebhook',\
 description: 'Configure webhook URL',\
 action: 'Set webhook',\
 },\
 {\
 name: 'Get Webhook',\
 value: 'getWebhook',\
 description: 'Get current webhook configuration',\
 action: 'Get webhook',\
 },\
 {\
 name: 'Delete Webhook',\
 value: 'deleteWebhook',\
 description: 'Remove webhook configuration',\
 action: 'Delete webhook',\
 },\
 \],\
 default: 'setWebhook',\
 },\
 // COMMON FIELDS\
 {\
 displayName: 'Phone Number',\
 name: 'phoneNumber',\
 type: 'string',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['message', 'media', 'contact'\],\
 operation: \[\
 'sendText',\
 'sendTemplate',\
 'sendQuickReply',\
 'sendList',\
 'sendLocation',\
 'sendImage',\
 'sendDocument',\
 'sendAudio',\
 'sendVideo',\
 'sendSticker',\
 'sendContact',\
 'getContactInfo',\
 'checkNumber',\
 'getProfilePhoto',\
 'blockContact',\
 'unblockContact',\
 \],\
 },\
 },\
 default: '',\
 description: 'WhatsApp number with country code (e.g., 5511999999999)',\
 },\
 // TEXT MESSAGE FIELDS\
 {\
 displayName: 'Message Text',\
 name: 'messageText',\
 type: 'string',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 operation: \['sendText'\],\
 },\
 },\
 default: '',\
 description: 'The text message to send',\
 },\
 // QUICK REPLY FIELDS\
 {\
 displayName: 'Message Text',\
 name: 'messageText',\
 type: 'string',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 operation: \['sendQuickReply'\],\
 },\
 },\
 default: '',\
 description: 'The text message with quick reply buttons',\
 },\
 {\
 displayName: 'Buttons',\
 name: 'buttons',\
 type: 'fixedCollection',\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 operation: \['sendQuickReply'\],\
 },\
 },\
 typeOptions: {\
 multipleValues: true,\
 },\
 default: {},\
 options: \[\
 {\
 displayName: 'Button',\
 name: 'button',\
 values: \[\
 {\
 displayName: 'Button Text',\
 name: 'text',\
 type: 'string',\
 default: '',\
 description: 'Text displayed on the button',\
 },\
 {\
 displayName: 'Button ID',\
 name: 'id',\
 type: 'string',\
 default: '',\
 description: 'Unique identifier for the button',\
 },\
 \],\
 },\
 \],\
 description: 'Quick reply buttons',\
 },\
 // LIST MESSAGE FIELDS\
 {\
 displayName: 'Message Text',\
 name: 'messageText',\
 type: 'string',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 operation: \['sendList'\],\
 },\
 },\
 default: '',\
 description: 'The header text for the list',\
 },\
 {\
 displayName: 'List Items',\
 name: 'listItems',\
 type: 'fixedCollection',\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 operation: \['sendList'\],\
 },\
 },\
 typeOptions: {\
 multipleValues: true,\
 },\
 default: {},\
 options: \[\
 {\
 displayName: 'Item',\
 name: 'item',\
 values: \[\
 {\
 displayName: 'Title',\
 name: 'title',\
 type: 'string',\
 default: '',\
 description: 'Item title',\
 },\
 {\
 displayName: 'Description',\
 name: 'description',\
 type: 'string',\
 default: '',\
 description: 'Item description',\
 },\
 {\
 displayName: 'ID',\
 name: 'id',\
 type: 'string',\
 default: '',\
 description: 'Unique identifier for the item',\
 },\
 \],\
 },\
 \],\
 description: 'List items',\
 },\
 // LOCATION FIELDS\
 {\
 displayName: 'Latitude',\
 name: 'latitude',\
 type: 'number',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 operation: \['sendLocation'\],\
 },\
 },\
 default: 0,\
 description: 'Latitude coordinate',\
 },\
 {\
 displayName: 'Longitude',\
 name: 'longitude',\
 type: 'number',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 operation: \['sendLocation'\],\
 },\
 },\
 default: 0,\
 description: 'Longitude coordinate',\
 },\
 {\
 displayName: 'Location Name',\
 name: 'locationName',\
 type: 'string',\
 displayOptions: {\
 show: {\
 resource: \['message'\],\
 operation: \['sendLocation'\],\
 },\
 },\
 default: '',\
 description: 'Name of the location (optional)',\
 },\
 // MEDIA FIELDS\
 {\
 displayName: 'Media URL',\
 name: 'mediaUrl',\
 type: 'string',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['media'\],\
 operation: \['sendImage', 'sendDocument', 'sendAudio', 'sendVideo', 'sendSticker'\],\
 },\
 },\
 default: '',\
 description: 'URL or base64 of the media file',\
 },\
 {\
 displayName: 'Caption',\
 name: 'caption',\
 type: 'string',\
 displayOptions: {\
 show: {\
 resource: \['media'\],\
 operation: \['sendImage', 'sendVideo'\],\
 },\
 },\
 default: '',\
 description: 'Caption for the media (optional)',\
 },\
 {\
 displayName: 'Filename',\
 name: 'filename',\
 type: 'string',\
 displayOptions: {\
 show: {\
 resource: \['media'\],\
 operation: \['sendDocument'\],\
 },\
 },\
 default: '',\
 description: 'Filename for the document (optional)',\
 },\
 // GROUP FIELDS\
 {\
 displayName: 'Group ID',\
 name: 'groupId',\
 type: 'string',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['group'\],\
 operation: \[\
 'getGroupInfo',\
 'updateGroup',\
 'addParticipant',\
 'removeParticipant',\
 'promoteAdmin',\
 'demoteAdmin',\
 'leaveGroup',\
 \],\
 },\
 },\
 default: '',\
 description: 'WhatsApp group ID',\
 },\
 {\
 displayName: 'Group Name',\
 name: 'groupName',\
 type: 'string',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['group'\],\
 operation: \['createGroup'\],\
 },\
 },\
 default: '',\
 description: 'Name for the new group',\
 },\
 {\
 displayName: 'Participants',\
 name: 'participants',\
 type: 'string',\
 displayOptions: {\
 show: {\
 resource: \['group'\],\
 operation: \['createGroup', 'addParticipant', 'removeParticipant', 'promoteAdmin', 'demoteAdmin'\],\
 },\
 },\
 default: '',\
 description: 'Phone numbers separated by commas (e.g., 5511999999999,5511888888888)',\
 },\
 // WEBHOOK FIELDS\
 {\
 displayName: 'Webhook URL',\
 name: 'webhookUrl',\
 type: 'string',\
 required: true,\
 displayOptions: {\
 show: {\
 resource: \['webhook'\],\
 operation: \['setWebhook'\],\
 },\
 },\
 default: '',\
 description: 'URL to receive webhook events',\
 },\
 // ADDITIONAL FIELDS\
 {\
 displayName: 'Additional Fields',\
 name: 'additionalFields',\
 type: 'collection',\
 placeholder: 'Add Field',\
 default: {},\
 options: \[\
 {\
 displayName: 'Reply to Message ID',\
 name: 'replyToMessageId',\
 type: 'string',\
 default: '',\
 description: 'ID of message to reply to',\
 },\
 {\
 displayName: 'Delay (seconds)',\
 name: 'delay',\
 type: 'number',\
 default: 0,\
 description: 'Delay before sending message',\
 },\
 {\
 displayName: 'Disable Link Preview',\
 name: 'disableLinkPreview',\
 type: 'boolean',\
 default: false,\
 description: 'Disable link previews in messages',\
 },\
 {\
 displayName: 'Mention Users',\
 name: 'mentionUsers',\
 type: 'string',\
 default: '',\
 description: 'Phone numbers to mention (comma-separated)',\
 },\
 \],\
 },\
 \],
 };
 }
 async execute() {
 const items = this.getInputData();
 const returnData = \[\];
 const credentials = await this.getCredentials('uazapiApi');
 const n8nToolsApiKey = credentials.n8nToolsApiKey;
 const apiUrl = credentials.apiUrl;
 const apiToken = credentials.apiToken;
 const instanceId = credentials.instanceId;
 for (let i = 0; i < items.length; i++) {
 try {
 const resource = this.getNodeParameter('resource', i);
 const operation = this.getNodeParameter('operation', i);
 const additionalFields = this.getNodeParameter('additionalFields', i);
 let endpoint = '';
 let method = 'POST';
 let body = {
 instance: instanceId,
 };
 let qs = {};
 // Build request based on resource and operation
 switch (resource) {
 case 'message':
 switch (operation) {
 case 'sendText':
 endpoint = '/v1/messages/text';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 message: this.getNodeParameter('messageText', i),
 ...additionalFields,
 };
 break;
 case 'sendTemplate':
 endpoint = '/v1/messages/template';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 template: this.getNodeParameter('templateName', i),
 ...additionalFields,
 };
 break;
 case 'sendQuickReply':
 const buttons = this.getNodeParameter('buttons', i);
 endpoint = '/v1/messages/buttons';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 message: this.getNodeParameter('messageText', i),
 buttons: buttons.button \|\| \[\],
 ...additionalFields,
 };
 break;
 case 'sendList':
 const listItems = this.getNodeParameter('listItems', i);
 endpoint = '/v1/messages/list';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 message: this.getNodeParameter('messageText', i),
 list: listItems.item \|\| \[\],
 ...additionalFields,
 };
 break;
 case 'sendLocation':
 endpoint = '/v1/messages/location';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 latitude: this.getNodeParameter('latitude', i),
 longitude: this.getNodeParameter('longitude', i),
 name: this.getNodeParameter('locationName', i, ''),
 ...additionalFields,
 };
 break;
 case 'getMessages':
 endpoint = '/v1/messages';
 method = 'GET';
 qs = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 limit: additionalFields.limit \|\| 50,
 };
 break;
 case 'markAsRead':
 endpoint = '/v1/messages/read';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 messageId: this.getNodeParameter('messageId', i),
 };
 break;
 }
 break;
 case 'media':
 switch (operation) {
 case 'sendImage':
 endpoint = '/v1/messages/image';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 image: this.getNodeParameter('mediaUrl', i),
 caption: this.getNodeParameter('caption', i, ''),
 ...additionalFields,
 };
 break;
 case 'sendDocument':
 endpoint = '/v1/messages/document';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 document: this.getNodeParameter('mediaUrl', i),
 filename: this.getNodeParameter('filename', i, ''),
 ...additionalFields,
 };
 break;
 case 'sendAudio':
 endpoint = '/v1/messages/audio';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 audio: this.getNodeParameter('mediaUrl', i),
 ...additionalFields,
 };
 break;
 case 'sendVideo':
 endpoint = '/v1/messages/video';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 video: this.getNodeParameter('mediaUrl', i),
 caption: this.getNodeParameter('caption', i, ''),
 ...additionalFields,
 };
 break;
 case 'sendSticker':
 endpoint = '/v1/messages/sticker';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 sticker: this.getNodeParameter('mediaUrl', i),
 ...additionalFields,
 };
 break;
 case 'uploadMedia':
 endpoint = '/v1/media/upload';
 body = {
 instance: instanceId,
 media: this.getNodeParameter('mediaUrl', i),
 };
 break;
 case 'getMediaUrl':
 endpoint = '/v1/media/download';
 method = 'GET';
 qs = {
 instance: instanceId,
 mediaId: this.getNodeParameter('mediaId', i),
 };
 break;
 }
 break;
 case 'contact':
 switch (operation) {
 case 'sendContact':
 endpoint = '/v1/messages/contact';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 contact: this.getNodeParameter('contactNumber', i),
 ...additionalFields,
 };
 break;
 case 'getContactInfo':
 endpoint = '/v1/contacts/info';
 method = 'GET';
 qs = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 };
 break;
 case 'checkNumber':
 endpoint = '/v1/contacts/check';
 method = 'GET';
 qs = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 };
 break;
 case 'getProfilePhoto':
 endpoint = '/v1/contacts/photo';
 method = 'GET';
 qs = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 };
 break;
 case 'blockContact':
 endpoint = '/v1/contacts/block';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 };
 break;
 case 'unblockContact':
 endpoint = '/v1/contacts/unblock';
 body = {
 instance: instanceId,
 number: this.getNodeParameter('phoneNumber', i),
 };
 break;
 }
 break;
 case 'group':
 switch (operation) {
 case 'createGroup':
 endpoint = '/v1/groups/create';
 const createParticipants = this.getNodeParameter('participants', i, '');
 body = {
 instance: instanceId,
 name: this.getNodeParameter('groupName', i),
 participants: createParticipants.split(',').map(p => p.trim()),
 ...additionalFields,
 };
 break;
 case 'getGroupInfo':
 endpoint = '/v1/groups/info';
 method = 'GET';
 qs = {
 instance: instanceId,
 groupId: this.getNodeParameter('groupId', i),
 };
 break;
 case 'updateGroup':
 endpoint = '/v1/groups/update';
 body = {
 instance: instanceId,
 groupId: this.getNodeParameter('groupId', i),
 ...additionalFields,
 };
 break;
 case 'addParticipant':
 endpoint = '/v1/groups/participants/add';
 const addParticipants = this.getNodeParameter('participants', i);
 body = {
 instance: instanceId,
 groupId: this.getNodeParameter('groupId', i),
 participants: addParticipants.split(',').map(p => p.trim()),
 };
 break;
 case 'removeParticipant':
 endpoint = '/v1/groups/participants/remove';
 const removeParticipants = this.getNodeParameter('participants', i);
 body = {
 instance: instanceId,
 groupId: this.getNodeParameter('groupId', i),
 participants: removeParticipants.split(',').map(p => p.trim()),
 };
 break;
 case 'promoteAdmin':
 endpoint = '/v1/groups/participants/promote';
 const promoteParticipants = this.getNodeParameter('participants', i);
 body = {
 instance: instanceId,
 groupId: this.getNodeParameter('groupId', i),
 participants: promoteParticipants.split(',').map(p => p.trim()),
 };
 break;
 case 'demoteAdmin':
 endpoint = '/v1/groups/participants/demote';
 const demoteParticipants = this.getNodeParameter('participants', i);
 body = {
 instance: instanceId,
 groupId: this.getNodeParameter('groupId', i),
 participants: demoteParticipants.split(',').map(p => p.trim()),
 };
 break;
 case 'leaveGroup':
 endpoint = '/v1/groups/leave';
 body = {
 instance: instanceId,
 groupId: this.getNodeParameter('groupId', i),
 };
 break;
 }
 break;
 case 'instance':
 switch (operation) {
 case 'getStatus':
 endpoint = '/v1/instance/status';
 method = 'GET';
 qs = { instance: instanceId };
 break;
 case 'getQrCode':
 endpoint = '/v1/instance/qr';
 method = 'GET';
 qs = { instance: instanceId };
 break;
 case 'restartInstance':
 endpoint = '/v1/instance/restart';
 body = { instance: instanceId };
 break;
 case 'logout':
 endpoint = '/v1/instance/logout';
 body = { instance: instanceId };
 break;
 case 'setProfile':
 endpoint = '/v1/instance/profile';
 body = {
 instance: instanceId,
 ...additionalFields,
 };
 break;
 case 'getChats':
 endpoint = '/v1/chats';
 method = 'GET';
 qs = { instance: instanceId };
 break;
 }
 break;
 case 'webhook':
 switch (operation) {
 case 'setWebhook':
 endpoint = '/v1/webhook';
 body = {
 instance: instanceId,
 webhook: this.getNodeParameter('webhookUrl', i),
 ...additionalFields,
 };
 break;
 case 'getWebhook':
 endpoint = '/v1/webhook';
 method = 'GET';
 qs = { instance: instanceId };
 break;
 case 'deleteWebhook':
 endpoint = '/v1/webhook';
 method = 'DELETE';
 body = { instance: instanceId };
 break;
 }
 break;
 default:
 throw new n8n\_workflow\_1.NodeOperationError(this.getNode(), \`Unknown resource: ${resource}\`);
 }
 // Prepare proxy request via N8N Tools API
 const proxyPayload = {
 service: 'uazapi',
 method: method,
 endpoint: endpoint,
 baseUrl: apiUrl,
 headers: {
 'Authorization': \`Bearer ${apiToken}\`,
 'Content-Type': 'application/json',
 },
 body: method !== 'GET' && method !== 'DELETE' ? body : undefined,
 queryParams: Object.keys(qs).length > 0 ? qs : undefined,
 };
 // Make the API request via N8N Tools proxy
 const options = {
 method: 'POST',
 url: 'https://n8ntools.io/api/v1/proxy/uazapi',
 headers: {
 'Content-Type': 'application/json',
 'x-api-key': n8nToolsApiKey,
 },
 body: proxyPayload,
 json: true,
 };
 const response = await this.helpers.request(options);
 returnData.push({
 json: response,
 pairedItem: { item: i },
 });
 }
 catch (error) {
 if (this.continueOnFail()) {
 returnData.push({
 json: { error: error.message },
 pairedItem: { item: i },
 });
 continue;
 }
 throw error;
 }
 }
 return \[returnData\];
 }
}
exports.N8nToolsUazapi = N8nToolsUazapi;