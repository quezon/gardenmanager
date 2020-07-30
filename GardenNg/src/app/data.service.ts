import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {

    }

    getObjects(domain) {
        console.log('http://localhost:8080/' + domain);
        return this.http.get('http://localhost:8080/' + domain);
    }

    getSelectList(domain) {
        return this.http.get('http://localhost:8080/' + domain + '/select');
    }
}