/*Используя fetch c помощью промисов(then) 
 получить url - - https://rickandmortyapi.com/api/character (без лимитов)
 обработать результат (json) и получить все ссылки содержащиеся в ответе. 
 Обработать возможные ошибки.
- сделать запросы по первым 10 ссылкам (c помощью Promise.all) oбработать возможные ошибки, 
и сохранить статус коды ответов - вывести на консоль. */
/* №№№1
function fetchAllLinks(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Извлекаем ссылки 
            const links = data.results.map(character => character.url);
            console.log('Ссылки на персонажей:', links);

            // рекурсия
            if (data.info.next) {
                return fetchAllLinks(data.info.next).then(nextLinks => links.concat(nextLinks));
            } else {
                return links;
            }
        })
        .catch(error => {
            console.error('Ошибка при выполнении запроса:', error);

        });
}

fetchAllLinks('https://rickandmortyapi.com/api/character')
    .then(allLinks => {
        if (allLinks.length === 0) {
            console.error('Не удалось получить ссылки на персонажей');
            return;
        }

        console.log('Все ссылки на персонажей:', allLinks);

        // для запросов по первым 10 ссылкам
        const requests = allLinks.slice(0, 10).map(url =>
            fetch(url)
                .then(response => ({
                    url,
                    status: response.status
                }))
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
 */


//*****************№2*****************//

// Функция для извлечения всех ссылок из объекта JSON
function extractLinks(data) {
    let links = []; // Массив для хранения ссылок
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

function fetchAllLinks(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка при запросе: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const links = extractLinks(data);
            console.log(`Ссылки, найденные на ${url}:`, links);
            return links;
        })
        .catch(error => {
            console.error(`Ошибка при выполнении запроса к ${url}:`, error.message);
            return [];
        });
}

fetchAllLinks('https://rickandmortyapi.com/api/character')
    .then(allLinks => {
        if (allLinks.length === 0) {
            console.error('Не удалось получить ссылки.');
            return;
        }

        console.log('Все найденные ссылки:', allLinks);

        // Создаём запросы по первым 10 ссылкам
        const requests = allLinks.slice(0, 10).map(url =>
            fetch(url)
                .then(response => ({
                    url,
                    status: response.status
                }))
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
