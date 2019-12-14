# Audit Forwarding 

Audit Forwarding is a fantastic feature offered by Segment. However, there are **two limitations**. 
  * You can't tell at a glance which workspace user triggered the event 
  * All events are named 'audit' 

This Custom Source will: 
1. Fetch the email address of the workspace user who triggered the event
2. Enhance event names

*Note: The second enhancement allows Slack templates to be much more dynamic and only inlcude relevant fields. This repo includes slack templates you can use!*
 

## Getting Started
### Prerequisites
#### Functions Access
You must have to access Functions. To request access to Functions, navigate to the Build page of the catalog [here](https://app.segment.com/goto-my-workspace/build/catalog).

#### Workspace Access Token
You need a workspace access token. As a workspace owner, you can create access tokens via the Access Management page in Admin settings. All tokens are required to have a description.

> Warning: Secret Token
>
> Note that you can not retrieve the plain-text `token` later, so you should save it in a secret manager. If you lose the `token` you can generate a new one.

### Step 1 - Custom Source Setup
1. Navigate to the Build page in the Catalog [here](https://app.segment.com/goto-my-workspace/build/catalog) and click on “Create Source”
2. Give your Custom Source a name
2. From the source overview page, click **Write New Function** to open the web editor
3. Copy the code from the handler.js file in this repo's folder and paste it into the Source Function Editor
4. Add two settings. To add a setting click on the settings within the Source Function Editor and click **Add a Setting**
5. Add a `Text input` setting with the name `workspaceSlug` and enter your workspace slug as a value. 
6. Add a `Text input` setting with the name `workspaceToken` and enter your workspace access token as a value. **Make sure to check the Encypted box!**
7. Save your Function by pressing the blue **Save** button in the bottom left

### Step 2 - setup HTTP Source and Webhook
Audit events do not function the same as 'regular' events. Thus you cannot forward Audits events directly to a Custom Source. Therefore we need to set up a Source that will receive the events and forward them to your Custom Source.

1. Create an [HTTP API Source](https://app.segment.com/goto-my-workspace/sources/catalog/http-api)
2. Add a [Webhooks destination](https://app.segment.com/james9446/destinations/catalog/webhooks)
3. Go to **Settings >> Connection Settings >> Webhooks URL**
4. Enter the webhook URL from the Custom Source you created in step 1

### Step 3 - Enable Audit Forwarding 
1. Go to **Settings >> Audit Forwarding**
2. Press the dropdown and select the **HTTP API Source** you created in step 2
3. Toggle the button to enable Audit Forwarding

# Set up Slack!

## Setup
1. Follow [these instructions](https://segment.com/docs/destinations/slack/#getting-started) to connect your Custom Function to a Slack Destination
2. For each event template, click **Add another Event Name** to create a new event setting
3. Enter the **Event Name Regex Pattern** into **Segment Event Name** field
4. Copy the corresponding **Event Template** into the **Event Template** field
5. Toggle on **Regex Matching**

# Event Templates
## Audience Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Audience Created</td>
  </tr>
  <tr>
    <td>Audience Deleted</td>
  </tr>
  <tr>
    <td>Audience Modified</td>
  </tr>
  <tr>
    <td>Audience CSV Downloaded</td>
  </tr>
  <tr>
    <td>Audience Run Failed</td>
  </tr>
  <tr>
    <td>Audience Destination Sync Failed</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
^Audience
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```


## Computed Trait Events

<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Computed Trait Created</td>
  </tr>
  <tr>
    <td>Computed Trait Modified</td>
  </tr>
  <tr>
    <td>Computed Trait Deleted</td>
  </tr>
  <tr>
    <td>Computed Trait CSV Downloaded</td>
  </tr>
  <tr>
    <td>Computed Trait Run Failed</td>
  </tr>
  <tr>
    <td>Computed Trait Destination Sync Failed</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
^Computed Trait
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
``` 

## Destination Filter Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Destination Filter Created</td>
  </tr>
  <tr>
    <td>Destination Filter Modified</td>
  </tr>
  <tr>
    <td>Destination Filter Enabled</td>
  </tr>
  <tr>
    <td>Destination Filter Disabled</td>
  </tr>
  <tr>
    <td>Destination Filter Deleted</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
^Destination Filter
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```


## Integrations Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Integration Created</td>
  </tr>
  <tr>
    <td>Integration Modified</td>
  </tr>
  <tr>
    <td>Integration Enabled</td>
  </tr>
  <tr>
    <td>Integration Disabled</td>
  </tr>
  <tr>
    <td>Integration Deleted</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
^Integration
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}}\n 
*metadata_id:* {{properties.details.metadata_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*source_id:* {{properties.details.source_id}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```

## Personas Warehouse Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Personas Warehouse Source Created</td>
  </tr>
  <tr>
    <td>Personas Warehouse Source Modified</td>
  </tr>
  <tr>
    <td>Personas Warehouse Source Deleted</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
^Personas Warehouse
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```

## Schema Events

<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Schema Default Edited To Allow Identify Traits On Violation</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Allow New Group Traits</td>
  </tr>
  <tr>
    <td>Schema Group Property Allowed</td>
  </tr>
  <tr>
    <td>Schema Group Property Blocked</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Omit New Identify Traits</td>
  </tr>
  <tr>
    <td>Schema Identify Trait Archived</td>
  </tr>
  <tr>
    <td>Schema Event Property Rule Edited To Required</td>
  </tr>
  <tr>
    <td>Schema Event Property Conditions Edited</td>
  </tr>
  <tr>
    <td>Schema Event Property Rule Edited To Forbidden</td>
  </tr>
  <tr>
    <td>Schema Event Property Rule Edited To Optional</td>
  </tr>
  <tr>
    <td>Schema Identify Trait Allowed</td>
  </tr>
  <tr>
    <td>Schema Event Archived</td>
  </tr>
  <tr>
    <td>Schema Identify Trait Blocked</td>
  </tr>
  <tr>
    <td>Schema Event Blocked</td>
  </tr>
  <tr>
    <td>Schema Event Allowed</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Allow New Events</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Omit Identify Traits On Violation</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Allow New Identify Traits</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Omit New Event Properties</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Allow Group Traits On Violation</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Omit New Group Traits</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Allow New Event Properties</td>
  </tr>
  <tr>
    <td>Schema Default Edited To Block New Events</td>
  </tr>
  <tr>
    <td>Schema JSON File Upload</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
^Schema
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}}\n 
*description:* {{properties.details.description}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*source_id:* {{properties.details.source_id}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```

## Source Events
<table>
  <tr>
   <th>Events</th>
  </tr>
  <tr>
   <td>Source Created</td>
  </tr>
  <tr>
   <td>Source Modified</td>
  </tr>
  <tr>
   <td>Source Enabled</td>
  </tr>
  <tr>
   <td>Source Disabled</td>
  </tr>
  <tr>
   <td>Source Deleted</td>
  </tr>
  <tr>
   <td>Source Function Updated</td>
  </tr>
  <tr>
   <td>Source Run Failed</td>
  </tr>
  <tr>
   <td>Source Function Updated</td>
  </tr>
  <tr>
   <td>Source Run Failed</td>
  </tr>
  <tr>
   <td>Source Connected To Tracking Plan</td>
  </tr>
  <tr>
   <td>Source Disconnected From Tracking Plan</td>
  </tr>
  <tr>
   <td>Source Connected To Space</td>
  </tr>
  <tr>
   <td>Source Disconnected From Space</td>
  </tr>
</table>

### Event Name Regex Pattern

```
^Source
```

### Event Template 

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*source_id:* {{properties.details.source_id}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```

## Space Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Space Created</td>
  </tr>
  <tr>
    <td>Space Modified</td>
  </tr>
  <tr>
    <td>Space Deleted</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
^Space
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```

## Tracking Plan Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Tracking Plan Created</td>
  </tr>
  <tr>
    <td>Tracking Plan Modified</td>
  </tr>
  <tr>
    <td>Tracking Plan Deleted</td>
  </tr>
  <tr>
    <td>Tracking Plan Inferred</td>
  </tr>
  <tr>
    <td>Tracking Plan New Event Blocked</td>
  </tr>
  <tr>
    <td>Tracking Plan New Event Allowed</td>
  </tr>
  <tr>
    <td>Tracking Plan New Group Trait Omitted</td>
  </tr>
  <tr>
    <td>Tracking Plan New Identify Trait Omitted</td>
  </tr>
  <tr>
    <td>Tracking Plan New Track Property Omitted</td>
  </tr>
  <tr>
    <td>Tracking Plan Operations Updated</td>
  </tr>
  <tr>
    <td>Tracking Plan Updated</td>
  </tr>
</table>


#### Event Name Regex Pattern

```
^Tracking Plan
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```

## Violation Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Violations Detected</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
Violations Detected
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*timestamp:* {{timestamp}}
```

## Warehouse Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Warehouse Created</td>
  </tr>
  <tr>
    <td>Warehouse Modified</td>
  </tr>
  <tr>
    <td>Warehouse Enabled</td>
  </tr>
  <tr>
    <td>Warehouse Disabled</td>
  </tr>
  <tr>
    <td>Warehouse Deleted</td>
  </tr>
  <tr>
    <td>Warehouse Run Failed</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
^Warehouse
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*subject:* {{properties.details.subject}} \n 
*target:* {{properties.details.target}} \n 
*warehouse_id:* {{properties.details.warehouse_id}} \n 
*timestamp:* {{timestamp}}
```

## System Events
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>New Event Allowed</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
New Event Allowed
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*system_event:* This event was triggered by the system. \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*blocked:* {{properties.details.blocked}} \n 
*message_id:* {{properties.details.message_id}} \n 
*name:* {{properties.details.name}} \n 
*planned:* {{properties.details.planned}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*source_id:* {{properties.details.source_id}} \n 
*source_name:* {{properties.details.source_name}} \n 
*source_slug:* {{properties.details.source_slug}} \n 
*target:* {{properties.details.target}} \n 
*tracking_plan_connected:* {{properties.details.tracking_plan_connected}} \n 
*tracking_plan_id:* {{properties.details.tracking_plan_id}} \n 
*type:* {{properties.details.type}} \n 
*timestamp:* {{timestamp}}
```

## Permission Check Event
<table>
  <tr>
    <th>Events</th>
  </tr>
  <tr>
    <td>Permission Check</td>
  </tr>
</table>

#### Event Name Regex Pattern

```
Permission Check
```

#### Event Template

```
:gear: *{{properties.type}}* \n 
*email:* {{properties.email}} \n 
*userId:* {{userId}} \n 
*workspace_id:* {{properties.workspace_id}} \n 
*action:* {{properties.details.action}} \n 
*resource_id:* {{properties.details.resource_id}} \n 
*resource_type:* {{properties.details.resource_type}} \n 
*sso_connection_id:* {{properties.details.sso_connection_id}} \n 
*subject_id:* {{properties.details.subject_id}} \n 
*subject_type:* {{properties.details.subject_type}} \n 
*timestamp:* {{timestamp}}
```

## Want to Block Permission Check Events?

Uncomment the following code that is already in the Custom Source Function code.
```
if (requestBody.properties.type === 'Permission Check') {
  return;
}
```
