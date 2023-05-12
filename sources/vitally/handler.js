async function onRequest(request, settings) {
    const body = request.json();

    Segment.track({
        event: 'NPS Response Received',
        userId: body.match.user.externalId,
        properties: {
            nps_score: body.match.user.last_nps_score
        },
        context: {
            playbook_id: body.playbookId,
            playbook_external_id: body.playbookExternalId
        }
    });

    Segment.identify({
        userId: body.match.user.externalId,
        anonymousId: `vitally:${body.match.user.id}`,
        traits: {
            nps_score: body.match.user.last_nps_score,
            vitally_user_id: body.match.user.id
        }
    });
}
