/// <reference types="cypress" />

describe('API Test', () => {

    const assertHeaders = (headers) => {
        expect(headers).to.have.property('transfer-encoding', 'chunked');
        expect(headers).to.have.property('connection', 'keep-alive');
        expect(headers).to.have.property('vary', 'Accept,Cookie,Accept-Encoding');
        expect(headers).to.have.property('referrer-policy', 'same-origin');
        expect(headers).to.have.property('x-frame-options', 'DENY');
        expect(headers).to.have.property('x-content-type-options', 'nosniff');
        expect(headers).to.have.property('x-powered-by', 'Phusion Passenger(R) 6.0.23');
        expect(headers).to.have.property('status', '200 OK');
        expect(headers).to.have.property('nel', '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}');
        expect(headers).to.have.property('content-encoding', 'gzip');
        expect(headers).to.have.property('alt-svc', 'h3=":443"; ma=86400'); 
    }
    const loginInfo = {
        email: 'yulka818818@gmail.com',
        password: '123456',
    };
    const invalidloginInfo = {
        email: 'yulka8118@gmail.com',
        password: '12345',
    };
    
    it('API 1: Get All Products List', () => {
        cy.api('GET', 'https://automationexercise.com/api/productsList')
            .then((response) => {
                expect(response.status).to.eq(200);

                const body = JSON.parse(response.body);
                expect(body.products).to.be.an('array');
                expect(body.products.length).to.be.greaterThan(0);

                body.products.forEach((product) => {
                    expect(product).to.have.all.keys('id', 'name', 'price', 'brand', 'category');
                    expect(product.category).to.have.all.keys('usertype', 'category');
                    expect(product.id).to.be.a("number");
                    expect(product.name).to.be.a('string');
                    expect(product.price).to.be.a('string');
                    expect(product.brand).to.be.a('string');
                    expect(product.category.usertype).to.be.a('object');
                    expect(product.category.category).to.be.a('string');
                });
            });
    });

    it('API 2: POST To All Products List', () => {
        cy.api({
            method: 'POST',
            url: 'https://automationexercise.com/api/productsList',
        }).then((response) => {
            expect(response.status).to.eq(200);
            const body = JSON.parse(response.body);
            assertHeaders(response.headers);
            expect(body.responseCode).to.eq(405);
            expect(body.message).to.eq('This request method is not supported.');
        });
    });

    it('API 3: Get All Brands List', () => {
        cy.api('GET', 'https://automationexercise.com/api/brandsList')
            .then((response) => {
                expect(response.status).to.eq(200);

                const body = JSON.parse(response.body);
                expect(body.brands).to.be.an('array');
                expect(body.brands.length).to.eq(34);
                assertHeaders(response.headers);
                body.brands.forEach((brands) => {
                    expect(brands).to.have.all.keys('id', 'brand');
                    expect(brands.id).to.be.a("number");
                    expect(brands.brand).to.be.a('string');
                });
            });
    });
    it('API 4: PUT To All Brands List', () => {
        cy.api({
            method: 'PUT',
            url: 'https://automationexercise.com/api/brandsList',
        }).then((response) => {
            expect(response.status).to.eq(200);
            const body = JSON.parse(response.body);
            assertHeaders(response.headers);
            expect(body.responseCode).to.eq(405);
            expect(body.message).to.eq('This request method is not supported.');
        });

    });
    it('API 5: POST To Search Product', () => {
        cy.api({
            method: 'POST',
            url: 'https://automationexercise.com/api/searchProduct',
            form: true,
            body: {
                search_product: 'tshirt'
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            const body = JSON.parse(response.body);
            assertHeaders(response.headers);
            expect(body.responseCode).to.eq(200);
            expect(body.products).to.be.an('array');
            expect(body.products.length).to.be.greaterThan(0);

            body.products.forEach((product) => {
                expect(product).to.have.all.keys('id', 'name', 'price', 'brand', 'category');
                expect(product.id).to.be.a('number');
                expect(product.name).to.be.a('string');
                expect(product.price).to.be.a('string');
                expect(product.brand).to.be.a('string');
                expect(product.category).to.have.all.keys('usertype', 'category');
                expect(product.category.usertype).to.have.all.keys('usertype');
                expect(product.category.usertype.usertype).to.be.a('string');
                expect(product.category.category).to.be.a('string');
            });
        });
    });
    it('API 6: POST To Search Product with search_product parameter', () => {
        cy.api({
            method: 'POST',
            url: 'https://automationexercise.com/api/searchProduct',
            form: true,
            body: {},
        }).then((response) => {
            expect(response.status).to.eq(200);
            assertHeaders(response.headers);
            const body = JSON.parse(response.body);
            expect(body.responseCode).to.eq(400)
            expect(body.message).to.eq('Bad request, search_product parameter is missing in POST request.');
        });
    });


    it('API 7: POST To Verify Login with valid details', () => {
        const apiUrl = 'https://automationexercise.com/api/verifyLogin';
        const loginInfo = {
            email: 'yulka818818@gmail.com',
            password: '123456',
        };
        cy.api({
            method: 'POST',
            url: apiUrl,
            form: true,
            body: loginInfo,
        }).then((response) => {
            expect(response.status).to.eq(200);
            const parsedBody = JSON.parse(response.body);
            assertHeaders(response.headers);
            expect(parsedBody.responseCode).to.eq(200);
            expect(parsedBody.message).to.eq('User exists!');
        });
    });


    it('API 8: POST To Verify Login without email parameter', () => {
        cy.api({
            method: 'POST',
            url: 'https://automationexercise.com/api/verifyLogin',
            form: true,
            body: loginInfo.password,
        }).then((response) => {
            expect(response.status).to.eq(200);
            assertHeaders(response.headers);
            const body = JSON.parse(response.body);
            expect(body.responseCode).to.eq(400)
            expect(body.message).to.eq('Bad request, email or password parameter is missing in POST request.');
        });
    });
    it('API 9: DELETE To Verify Login', () => {
        cy.api({
            method: 'DELETE',
            url: 'https://automationexercise.com/api/verifyLogin',
            form: true,
            body: loginInfo,
        }).then((response) => {
            expect(response.status).to.eq(200);
            assertHeaders(response.headers);
            const body = JSON.parse(response.body);
            expect(body.responseCode).to.eq(405)
            expect(body.message).to.eq('This request method is not supported.');
        });
    });
    it('API 10: POST To Verify Login with invalid details', () => {
        cy.api({
            method: 'POST',
            url: 'https://automationexercise.com/api/verifyLogin',
            form: true,
            body: invalidloginInfo,
        }).then((response) => {
            expect(response.status).to.eq(200);
            assertHeaders(response.headers);
            const body = JSON.parse(response.body);
            expect(body.responseCode).to.eq(404)
            expect(body.message).to.eq('User not found!');
        });
    });
    it('API 11: POST To Create/Register User Account', () => {
        cy.api({
            method: 'POST',
            url: 'https://automationexercise.com/api/createAccount',
            form: true,
            body: {
                "name": "IRA",
                "email": "irakazzz123@gmail.com",
                "password": "12345",
                "title": "Mr",
                "birth_date": "01",
                "birth_month": "January",
                "birth_year": "1990",
                "firstname": "Ira",
                "lastname": "Ivanova",
                "company": "BBC",
                "address1": "",
                "address2": "Адрес 2",
                "country": "Chile",
                "zipcode": "486000",
                "state": "",
                "city": "Puerto Montt",
                "mobile_number": "+56456789012"
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            assertHeaders(response.headers);
            const body = JSON.parse(response.body);
            expect(body.responseCode).to.eq(201)
            expect(body.message).to.eq('User created!');
        });
    });
    it('API 14: GET user account detail by email', () => {
        cy.api({
            method: 'GET',
            url: 'https://automationexercise.com/api/getUserDetailByEmail',
            qs: {
                email: 'irakazzz123@gmail.com',
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            const body = JSON.parse(response.body);
            assertHeaders(response.headers);
            expect(body).to.have.property('user');
            const user = body.user;
            expect(user).to.have.property('id').that.is.a('number');
            expect(user).to.have.property('name').that.is.a('string');
            expect(user).to.have.property('email').that.is.a('string');
            expect(user).to.have.property('first_name').that.is.a('string');
            expect(user).to.have.property('last_name').that.is.a('string');
            expect(user).to.have.property('country').that.is.a('string');
            expect(user).to.have.property('city').that.is.a('string');
            
            //expect(user).to.have.property('id', 503148); падает с каждым новым кругом
            expect(user).to.have.property('name', 'IRA');
            expect(user).to.have.property('email', 'irakazzz123@gmail.com');
            expect(user).to.have.property('first_name', 'Ira');
            expect(user).to.have.property('last_name', 'Ivanova');
            expect(user).to.have.property('country', 'Chile');
            expect(user).to.have.property('city', 'Puerto Montt');
        });
    });
    it('API 13: PUT METHOD To Update User Account', () => {
        cy.api({
            method: 'PUT',
            url: ' https://automationexercise.com/api/updateAccount',
            form: true,
            body: {
                "name": "IRA",
                "email": "irakazzz123@gmail.com",
                "password": "12345",
                "title": "Mr",
                "birth_date": "01",
                "birth_month": "January",
                "birth_year": "1990",
                "firstname": "Ira",
                "lastname": "Ivanova",
                "company": "BBC",
                "address1": "",
                "address2": "Адрес 2",
                "country": "Chile",
                "zipcode": "486000",
                "state": "",
                "city": "Puerto Montt",
                "mobile_number": "+56456789012"
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            assertHeaders(response.headers);
            const body = JSON.parse(response.body);
            expect(body.responseCode).to.eq(200)
            expect(body.message).to.eq('User updated!');
        });
    });
    
    it('API 12: DELETE METHOD To Delete User Account', () => {
        cy.api({
            method: 'DELETE',
            url: 'https://automationexercise.com/api/deleteAccount',
            form: true,
            body: {

                "email": "irakazzz123@gmail.com",
                "password": "12345",
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            assertHeaders(response.headers);
            const body = JSON.parse(response.body);
            expect(body.responseCode).to.eq(200)
            expect(body.message).to.eq('Account deleted!');
        });
    });

});



