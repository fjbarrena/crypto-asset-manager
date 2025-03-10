Feature: Security endpoints
    Scenario: Signup a new user successfully
        Given An unauthorized user
        When Uses the payload 
        """
        {
            "username": "theuser2",
            "plainPassword": "N0tiene$n0tiene",
            "role": "ADMIN",
            "initialBalance": 10000,
            "balanceCurrency": "eur"
        }
        """
        And calls with "POST" "/security/signup"
        Then Check that returned status is 201
        And Check that response property "username" is "theuser2"
        And Check that response property "role" is "ADMIN"
        And Save the response property "id" in the key "theuser2_response.id"