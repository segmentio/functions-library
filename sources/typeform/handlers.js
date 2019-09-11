/**
 * Typeform: Online form building and online surveys
 * Use case: When a form or survey is filled out, capture that information to send through to Segment to trigger other actions
 * 
 * Please do not delete [used for Intellisense]
 * @param {ServerRequest} request The incoming webhook request
 * @param {Object.<string, any>} settings Custom settings
 * @return {Promise<any[]>}
 */
async function onRequest(request, settings) {
  let eventBody = request.json();
  const formResponse = eventBody.form_response;

  // Iterates through nested fields to build question answer pairs
  for (var i=0; i < formResponse.definition.fields.length; i++) {
    buildQuestion(formResponse.definition.fields[i], formResponse.form_id)
    buildAnswer(formResponse.answers[i], formResponse.definition.fields[i].id)
  }

  if (eventBody.event_type == 'form_response') {
    Segment.set({
      collection: 'form_responses',
      id: formResponse.form_id,
      properties: {
        token: formResponse.token,
        submitTime: formResponse.submitted_at,
        landTime: formResponse.landed_at,
        formTitle: formResponse.definition.title
      }
    })
  }
}

// Helper Functions

function buildAnswerObj(fullAnswer) {
  if(fullAnswer["choices"]  != undefined) {
    return fullAnswer["choices"]["labels"].join();
  } else if (fullAnswer["choice"] != undefined) {
    return fullAnswer["choice"]["label"];
  } else {
    return String(fullAnswer[fullAnswer.type])
  }
}

function buildQuestion(formFields, id) {
  Segment.set({
    collection: 'form_questions',
    id: id,
    properties: {
      responseId: id,
      title: formFields.title,
      type: formFields.type,
      ref: formFields.ref,
      allowMultipleSelections: formFields.allow_multiple_selections,
      allowOtherChoices: formFields.allow_other_choices
    }
  })
}

function buildAnswer(answerFields, questionId) {
  Segment.set({
    collection: 'form_answers',
    id: answerFields.id,
    properties: {
      questionId: questionId,
      type: answerFields.type,
      answer: buildAnswerObj(answerFields)
    }
  })
}
