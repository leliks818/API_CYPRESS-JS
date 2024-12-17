const baseUrl = 'https://rickandmortyapi.com/api/character';
const limit = 10;

// Функция для извлечения всех ссылок из объекта JSON
function extractLinks(data) {
    let links = []; 
    if (Array.isArray(data)) {
        for (let item of data) {
            links = links.concat(extractLinks(item));
        }
    } 
    else if (typeof data === 'object' && data !== null) {
        for (let key in data) {
            if (typeof data[key] === 'string' && data[key].startsWith('http')) {
                links.push(data[key]);
            } 
            else {
                links = links.concat(extractLinks(data[key]));
            }
        }
    }
    return links;
}

// Функция для получения всех ссылок с проверкой их статуса
function fetchAllLinks(url, limit) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка при запросе: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const links = extractLinks(data); 
            return links;
        })
        .catch(error => {
            console.error(`Ошибка при выполнении запроса к ${url}:`, error.message);
            return []; 
        });
}

fetchAllLinks(baseUrl, limit)
    .then(allLinks => {
        if (allLinks.length === 0) {
            console.error('Не удалось получить ссылки.');
            return;
        }

        console.log('Все найденные ссылки:', allLinks); 

        // запросы по первым 10 ссылкам
        const requests = allLinks.slice(0, limit).map(url =>
            fetch(url)
                .then(response => {
                    console.assert(response.status === 200, `URL ${url} is not alive: status ${response.status}`);
                    return {
                        url,
                        status: response.status
                    };
                })
                .catch(error => ({
                    url,
                    error: error.message
                }))
        );

        return Promise.all(requests); 
    })
    .then(results => {
       
        results.forEach(result => {
            if (result.error) {
                console.log(`Ошибка при запросе к ${result.url}: ${result.error}`);
            } else {
                console.log(`Статус для ${result.url}: ${result.status}`);
            }
        });
    })
    .catch(error => {
        console.error('Ошибка при выполнении запроса к API:', error);
    });
