import axios from "axios";
import {key} from "../config";

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){
        
        try{
            // storing API call results in a variable res
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            //console.log(res);
            this.result = res.data.recipes;
            //console.log(this.result[0]); 
        } catch (error){
            alert(error);
        }
    
}}