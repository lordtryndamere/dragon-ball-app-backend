var EntitySchema = require("typeorm").EntitySchema;
const {USER_STATES,} = require('../constants/states')
module.exports = new EntitySchema({
    name: "Products", 
    tableName: "products", 
    columns: {
        id: {
            name:'id',
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            name:"name",
            type: "varchar",
            length:255,
            nullable:false,
        },
    
        description:{
            name:'description',
            type: "varchar",
            nullable:false
        },
        img:{
            name:'img',
            type:'varchar',
            length:350,
            nullable:false
        },
        price:{
            name:'price',
            type:'varchar',
            nullable:false
        },
        unitType:{
            name:'unit_type',
            type:'varchar',
            length:50,
            nullable:false
        },
        state:{
            type:"enum",
            default:USER_STATES.CREATED,
            enum:USER_STATES,
            nullable:false,
        },
        createdAt:{
            name:'created_at',
            type:'timestamp',
            nullable:false
        },
        
        updatedAt:{
            name:'updated_at',
            type:'timestamp',
            nullable:true
        }
    },
    relations: {
        drug: {
            target: "Drugs",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
});