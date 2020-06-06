import knex from './../database/connection'
import {Response, Request}from 'express'
class ItemsController {

  async list(request: Request, response: Response){
    const items = await knex('items').select('*');

    const serializesItems = items.map(item=>{
      return {
        id: item.id,
        title: item.title,
        image_url:`http://192.168.0.108:3333/uploads/${item.image}`
      }
    }) 
    
    return response.json(serializesItems);
  }
}


export default ItemsController;