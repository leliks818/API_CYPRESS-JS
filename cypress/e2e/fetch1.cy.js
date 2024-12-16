/*Используя fetch c помощью промисов(then) 
 получить url - - https://rickandmortyapi.com/api/character (без лимитов)
 обработать результат (json) и получить все ссылки содержащиеся в ответе. 
 Обработать возможные ошибки.
- сделать запросы по первым 10 ссылкам (c помощью Promise.all) oбработать возможные ошибки, 
и сохранить статус коды ответов - вывести на консоль. */

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
