import { AsyncStorage } from 'react-native';

export default class DataStore {
    // static base_url = 'https://dtappdemo.wpengine.com';
    static domain = '';

    static async setBaseUrl(domain) {
        DataStore.domain = domain;

        await AsyncStorage.setItem('@KeyStore:domain', domain);
    }

    static async _getBaseDomain() {

        if (!DataStore.domain) {
            //Read from storage
            DataStore.domain = await AsyncStorage.getItem('@KeyStore:domain');
        }

        return DataStore.domain;
    }

    static async getTokenAsync(config) {

        //Post for token
        let response;
        try {

            const domain = await this._getBaseDomain();

            response = await fetch('https://' + domain + "/wp-json/jwt-auth/v1/token", {
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
        const domain = await this._getBaseDomain();
        console.log('domain: '+domain);

        const response = await fetch('https://' + domain + "/wp-json/dt/v1/contacts", {
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