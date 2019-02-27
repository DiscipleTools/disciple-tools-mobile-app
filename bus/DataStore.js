export default class DataStore {
    static base_url = 'https://dtappdemo.wpengine.com';

    static async getTokenAsync(config) {

        //Post for token
        let response;
        try {
            response = await fetch(DataStore.base_url + "/wp-json/jwt-auth/v1/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: config.username,
                    password: config.password
                })
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }

        //get response
        const dataJson = await response.json();

        //check response
        const token = dataJson["token"];
        if (!token) {
            var msg = dataJson["message"];
            console.log('Error getting token: '+msg);
            throw new Error(msg)
        }

        return token;
    }

    static async getAllContactsAsync(authToken) {
        const response = await fetch(DataStore.base_url + "/wp-json/dt/v1/contacts", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            }
        });

        //get response
        const dataJson = await response.json();
        const contacts = [];

        //check response
        contactsArray = dataJson["contacts"];
        if (!contactsArray) {

            var msg = dataJson["message"];
            console.log('Error getting contacts: '+msg);
            throw new Error(msg)

        } else {

            contactsArray.forEach(contactJson => {
                contacts.push({
                    key: contactJson["ID"].toString(),
                    name: contactJson["post_title"],
                    status: contactJson["overall_status"],
                    seekerPath: contactJson["seeker_path"],
                    faithMilestones: contactJson["milestones"],
                    assignedTo: contactJson["assigned_to"]["name"],
                    locations: contactJson["locations"],
                    groups: contactJson["groups"] 
                });
            });

            return contacts;
        }

    }

}