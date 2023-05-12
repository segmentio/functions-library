async function onRequest(request, settings) {
    const body = request.json();
    const endpoint = body.date ?? 'latest';
    const baseUrl = `https://api.apilayer.com/exchangerates_data/${endpoint}`;
    const apiKey = process.env.API_KEY;
    const currencies = 'AUD';

    const httpOptions = {
        method: 'GET',
        headers: { apiKey: `${{ secrets.FIVETRAN_API_KEY }}` }
    };


    for (const currency of process.env.CURRENCIES.split(',')) {
        const url = `${baseUrl}?base=${currency}`;
    
        const response = await fetch(url, httpOptions).then(response =>
          response.json()
        );
    
        console.log('Exchange Rate Set', response);
    }

    // 
	// for (var currency of settings.currencies) {
	// 	const url = `${baseUrl}?base=${currency}`;

	// 	let response = await fetch(url, httpOptions).then(response =>
	// 		response.json()
	// 	);

	// 	// track is only to see output in Segment's source debugger
	// 	Segment.track({
	// 		event: 'Exchange Rate Set',
	// 		anonymousId: '-1',
	// 		properties: response
	// 	});

	// 	Segment.set({
	// 		collection: 'all_currencies',
	// 		id: response.base + ':' + response.date,
	// 		properties: response
	// 	});
	// }
}
