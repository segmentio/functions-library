/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  let eventBody = request.json()

  if (eventBody.event.object_type == 'opportunity') {
    Segment.set({
      collection: 'opportunities',
      id: eventBody.event.data.id,
      properties: {
        contact_name: eventBody.event.data.contact_name,
        lead_name: eventBody.event.data.lead_name,
        created_by_name: eventBody.event.data.created_by_name,
        value_period: eventBody.event.data.value_period,
        status_label: eventBody.event.data.status_label,
        status_id: eventBody.event.data.status_id,
        value_currency: eventBody.event.data.value_currency,
        confidence: eventBody.event.data.confidence,
        date_updated: eventBody.event.data.date_updated,
        lead_id: eventBody.event.data.lead_id,
        value_formatted: eventBody.event.data.value_formatted,
        value: eventBody.event.data.value,
        date_created: eventBody.event.data.date_created,
        date_won: eventBody.event.data.date_won,
        user_name: eventBody.event.data.user_name,
        updated_by: eventBody.event.data.updated_by,
        note: eventBody.event.data.note,
        integration_links: eventBody.event.data.integration_links,
        status_type: eventBody.event.data.status_type,
        organization_id: eventBody.event.data.organization_id,
        contact_id: eventBody.event.data.contact_id,
        updated_by_name: eventBody.event.data.updated_by_name,
        id: eventBody.event.data.id,
        date_lost: eventBody.event.data.date_lost,
        user_id: eventBody.event.data.user_id,
        created_by: eventBody.event.data.created_by,
        webhookId: eventBody.subscription_id, // id of the incoming webhook
        source: 'Close.io'
      }
    })
  }

  if (eventBody.event.object_type == 'lead') {
    Segment.set({
      collection: 'leads',
      id: eventBody.event.data.id,
      properties: {
        url: eventBody.event.data.url,
        addresses: eventBody.event.data.addresses,
        id: eventBody.event.data.id,
        updated_by: eventBody.event.data.updated_by,
        status_label: eventBody.event.data.status_label,
        created_by_name: eventBody.event.data.created_by_name,
        organization_id: eventBody.event.data.organization_id,
        created_by: eventBody.event.data.created_by,
        date_updated: eventBody.event.data.date_updated,
        date_created: eventBody.event.data.date_created,
        name: eventBody.event.data.name,
        contact_ids: eventBody.event.data.contact_ids,
        status_id: eventBody.event.data.status_id,
        display_name: eventBody.event.data.display_name,
        description: eventBody.event.data.description,
        updated_by_name: eventBody.event.data.updated_by_name,
        webhookId: eventBody.subscription_id, // id of the incoming webhook
        source: 'Close.io'
      }
    })
  }

  if (eventBody.event.object_type == 'contact') {
    Segment.set({
      collection: 'contacts',
      id: eventBody.event.data.id,
      properties: {
        urls: eventBody.event.data.urls,
        updated_by: eventBody.event.data.updated_by,
        organization_id: eventBody.event.data.organization_id,
        title: eventBody.event.data.title,
        phones: eventBody.event.data.phones,
        date_updated: eventBody.event.data.date_updated,
        date_created: eventBody.event.data.date_created,
        lead_id: eventBody.event.data.lead_id,
        name: eventBody.event.data.name,
        created_by: eventBody.event.data.created_by,
        id: eventBody.event.data.id,
        emails: eventBody.event.data.emails,
        webhookId: eventBody.subscription_id, // id of the incoming webhook
        source: 'Close.io'
      }
    })
  }

  if (eventBody.event.object_type == 'activity.note') {
    Segment.set({
      collection: 'activity_notes',
      id: eventBody.event.data.id,
      properties: {
        users: eventBody.event.data.users,
        date_updated: eventBody.event.data.date_updated,
        lead_id: eventBody.event.data.lead_id,
        updated_by: eventBody.event.data.updated_by,
        note: eventBody.event.data.note,
        user_id: eventBody.event.data.user_id,
        _type: eventBody.event.data._type,
        id: eventBody.event.data.id,
        updated_by_name: eventBody.event.data.updated_by_name,
        created_by: eventBody.event.data.created_by,
        created_by_name: eventBody.event.data.created_by_name,
        date_created: eventBody.event.data.date_created,
        contact_id: eventBody.event.data.contact_id,
        user_name: eventBody.event.data.user_name,
        organization_id: eventBody.event.data.organization_id,
        webhookId: eventBody.subscription_id, // id of the incoming webhook
        source: 'Close.io'
      }
    })
  }

  if (eventBody.event.object_type == 'activity.call') {
    Segment.set({
      collection: 'activity_calls',
      id: eventBody.event.data.id,
      properties: {
        date_created: eventBody.event.data.date_created,
        local_country_iso: eventBody.event.data.local_country_iso,
        disposition: eventBody.event.data.disposition,
        updated_by: eventBody.event.data.updated_by,
        status: eventBody.event.data.status,
        created_by_name: eventBody.event.data.created_by_name,
        transferred_to: eventBody.event.data.transferred_to,
        voicemail_duration: eventBody.event.data.voicemail_duration,
        lead_id: eventBody.event.data.lead_id,
        source: eventBody.event.data.source,
        duration: eventBody.event.data.duration,
        created_by: eventBody.event.data.created_by,
        user_id: eventBody.event.data.user_id,
        dialer_id: eventBody.event.data.dialer_id,
        remote_country_iso: eventBody.event.data.remote_country_iso,
        transferred_from: eventBody.event.data.transferred_from,
        recording_url: eventBody.event.data.recording_url,
        call_method: eventBody.event.data.call_method,
        has_recording: eventBody.event.data.has_recording,
        cost: eventBody.event.data.cost,
        remote_phone: eventBody.event.data.remote_phone,
        user_name: eventBody.event.data.user_name,
        users: eventBody.event.data.users,
        id: eventBody.event.data.id,
        remote_phone_formatted: eventBody.event.data.remote_phone_formatted,
        updated_by_name: eventBody.event.data.updated_by_name,
        contact_id: eventBody.event.data.contact_id,
        organization_id: eventBody.event.data.organization_id,
        note: eventBody.event.data.note,
        phone: eventBody.event.data.phone,
        local_phone_formatted: eventBody.event.data.local_phone_formatted,
        dialer_saved_search_id: eventBody.event.data.dialer_saved_search_id,
        direction: eventBody.event.data.direction,
        voicemail_url: eventBody.event.data.voicemail_url,
        quality_info: eventBody.event.data.quality_info,
        local_phone: eventBody.event.data.local_phone,
        _type: eventBody.event.data._type,
        is_to_group_number: eventBody.event.data.is_to_group_number,
        date_updated: eventBody.event.data.date_updated,
        webhookId: eventBody.subscription_id, // id of the incoming webhook
        source: 'Close.io'
      }
    })
  }

  if (eventBody.event.object_type == 'activity.email') {
    Segment.set({
      collection: 'activity_emails',
      id: eventBody.event.data.id,
      properties: {
        template_id: eventBody.event.data.template_id,
        user_name: eventBody.event.data.user_name,
        sequence_name: eventBody.event.data.sequence_name,
        _type: eventBody.event.data._type,
        user_id: eventBody.event.data.user_id,
        created_by_name: eventBody.event.data.created_by_name,
        in_reply_to_id: eventBody.event.data.in_reply_to_id,
        template_name: eventBody.event.data.template_name,
        followup_sequence_delay: eventBody.event.data.followup_sequence_delay,
        references: eventBody.event.data.references,
        body_text: eventBody.event.data.body_text,
        sender: eventBody.event.data.sender,
        updated_by: eventBody.event.data.updated_by,
        id: eventBody.event.data.id,
        body_preview: eventBody.event.data.body_preview,
        message_ids: eventBody.event.data.message_ids,
        followup_sequence_id: eventBody.event.data.followup_sequence_id,
        direction: eventBody.event.data.direction,
        body_html: eventBody.event.data.body_html,
        send_attempts: eventBody.event.data.send_attempts,
        has_reply: eventBody.event.data.has_reply,
        status: eventBody.event.data.status,
        date_sent: eventBody.event.data.date_sent,
        email_account_id: eventBody.event.data.email_account_id,
        opens_summary: eventBody.event.data.opens_summary,
        date_created: eventBody.event.data.date_created,
        contact_id: eventBody.event.data.contact_id,
        envelope: eventBody.event.data.envelope,
        lead_id: eventBody.event.data.lead_id,
        opens: eventBody.event.data.opens,
        cc: eventBody.event.data.cc,
        attachments: eventBody.event.data.attachments,
        to: eventBody.event.data.to,
        organization_id: eventBody.event.data.organization_id,
        users: eventBody.event.data.users,
        need_smtp_credentials: eventBody.event.data.need_smtp_credentials,
        date_scheduled: eventBody.event.data.date_scheduled,
        bulk_email_action_id: eventBody.event.data.bulk_email_action_id,
        bcc: eventBody.event.data.bcc,
        sequence_subscription_id: eventBody.event.data.sequence_subscription_id,
        date_updated: eventBody.event.data.date_updated,
        subject: eventBody.event.data.subject,
        thread_id: eventBody.event.data.thread_id,
        created_by: eventBody.event.data.created_by,
        sequence_id: eventBody.event.data.sequence_id,
        updated_by_name: eventBody.event.data.updated_by_name,
        webhookId: eventBody.subscription_id, // id of the incoming webhook
        source: 'Close.io'
      }
    })
  }


  if (eventBody.event.action == 'created') {
    let formattedType = eventBody.event.object_type.split('.')
    for (let i = 0; i < formattedType.length; i++) {
      formattedType[i] = formattedType[i].charAt(0).toUpperCase() + formattedType[i].slice(1);
    }
    const props = {
      date_created: eventBody.event.data.date_created,
      type: eventBody.event.object_type,
      id: eventBody.event.data.id,
      created_by: eventBody.event.data.created_by,
      webhookId: eventBody.subscription_id, // id of the incoming webhook
      source: 'Close.io'
    }

    Segment.track({
      type: 'track',
      event: formattedType.join(' ') + ' Created',
      userId: eventBody.event.data.created_by,
      properties: props
    })
  }

  if (eventBody.event.action == 'updated') {
    let formattedType = eventBody.event.object_type.split('.')
    for (let i = 0; i < formattedType.length; i++) {
      formattedType[i] = formattedType[i].charAt(0).toUpperCase() + formattedType[i].slice(1);
    }
    const props = {
      date_updated: eventBody.event.data.date_updated,
      date_created: eventBody.event.data.date_created,
      type: eventBody.event.object_type,
      id: eventBody.event.data.id,
      created_by: eventBody.event.data.created_by,
      webhookId: eventBody.subscription_id, // id of the incoming webhook
      source: 'Close.io'
    }

    Segment.track({
      type: 'track',
      event: formattedType.join(' ') + ' Updated',
      userId: eventBody.event.data.created_by,
      properties: props
    })
  }

  if (eventBody.event.action == 'deleted') {
    let formattedType = eventBody.event.object_type.split('.')
    for (let i = 0; i < formattedType.length; i++) {
      formattedType[i] = formattedType[i].charAt(0).toUpperCase() + formattedType[i].slice(1);
    }
    const props = {
      date_updated: eventBody.event.data.date_updated,
      date_created: eventBody.event.data.date_created,
      type: eventBody.event.object_type,
      id: eventBody.event.data.id,
      created_by: eventBody.event.data.created_by,
      webhookId: eventBody.subscription_id, // id of the incoming webhook
      source: 'Close.io'
    }

    Segment.track({
      type: 'track',
      event: formattedType.join(' ') + ' Deleted',
      userId: eventBody.event.data.created_by,
      properties: props
    })
  }
}
