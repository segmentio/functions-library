// Typeform: Online form building and online surveys
// Use case: When a form or survey is filled out, capture that information to send through to Segment to trigger other actions

exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;
  let returnValue = {
    objects: []
  }

  const formResponse = eventBody.form_response;

  // Iterates through nested fields to build question answer pairs
  for (var i=0; i < formResponse.definition.fields.length; i++) {
    returnValue.objects.push(buildQuestion(formResponse.definition.fields[i], formResponse.form_id))
    returnValue.objects.push(buildAnswer(formResponse.answers[i], formResponse.definition.fields[i].id))
  }

  if (eventBody.event_type == 'form_response') {
    const responseObj = {
      collection: 'form_responses',
      id: formResponse.form_id,
      properties: {
        token: formResponse.token,
        submitTime: formResponse.submitted_at,
        landTime: formResponse.landed_at,
        formTitle: formResponse.definition.title
      }
    }
    returnValue.objects.push(responseObj)
  }
  return(returnValue)
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
  const questionObj = {
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
  }
  return questionObj
}

function buildAnswer(answerFields, questionId) {
  const answerObj = {
    collection: 'form_answers',
    id: answerFields.id,
    properties: {
      questionId: questionId,
      type: answerFields.type,
      answer: buildAnswerObj(answerFields)
    }
  }
  return answerObj
}
