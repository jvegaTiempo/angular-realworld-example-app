/// <reference types="cypress">

describe("Signup & Login", () =>{
    let randomString = Math.random().toString(36).substring(2);
    let userName = "UserName" + randomString;
    let email = "Email" + randomString + "@gmail.com";
    let password = "Password1";
    let artTitle = "Article Title " + randomString;
    let artAbout = "This article is about " + randomString;
    let artContent = "Article content " + randomString;

    it("Test Valid Signup", () =>{
        cy.intercept("POST", "**/*.realworld.io/api/users").as("newUser");

        cy.visit("http://localhost:4200/");

        cy.get(".nav").contains("Sign up").click();
        cy.get("[placeholder='Username']").type(userName);
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get(".btn").contains("Sign up").click();

        cy.wait("@newUser").should(({request, response}) => {
            cy.log("Request: " + JSON.stringify(request));
            cy.log("Response: " + JSON.stringify(response));

            expect(request.body.user.email).to.eq(email);
            expect(request.body.user.password).to.eq(password);
            expect(request.body.user.username).to.eq(userName);

            expect(response.statusCode).to.eq(200);
            expect(response.statusMessage).to.eq("OK");
            expect(response.body.user.email).to.eq(email);
            expect(response.body.user.username).to.eq(userName);
        })
    })

    it("Test Valid Login & Add New Article", () =>{
        cy.intercept("GET", "**/api/articles*", {fixture: 'getArticles.json'}).as("getArticles");

        cy.visit("http://localhost:4200/");

        cy.get(".nav").contains("Sign in").click();
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get(".btn").contains("Sign in").click();
        cy.get(':nth-child(4) > .nav-link').contains(userName);

        cy.wait("@getArticles").should(({request, response}) => {
            cy.log("Request: " + JSON.stringify(request));
            cy.log("Response: " + JSON.stringify(response));
        })
    })
})

