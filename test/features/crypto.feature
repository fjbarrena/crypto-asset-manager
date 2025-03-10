Feature: Cryptoassets endpoints
    Scenario: Buy crypto successfully
        Given An unauthorized user
        When Uses the payload 
        """
        {
            "username": "theuser3",
            "plainPassword": "N0tiene$n0tiene",
            "role": "ADMIN",
            "initialBalance": 10000,
            "balanceCurrency": "eur"
        }
        """
        And calls with "POST" "/security/signup"
        And Save the response property "id" in the key "theuser3_response.id"
        Then Wait for 1000 milliseconds
        When Uses the payload
        """
        {
            "username": "theuser3",
            "plainPassword": "N0tiene$n0tiene"
        }
        """
        And calls with "POST" "/security/login"
        Then Set the JWT Authorization header
        Then Wait for 1000 milliseconds
        When Uses the payload 
        """
        {
            "assetToBuy": "doge",
            "quantity": 10,
            "buyerId": "${storedValues.theuser3_response.id}"
        }
        """
        And calls with "POST" "/cryptoassets/order"
        Then Check that returned status is 201