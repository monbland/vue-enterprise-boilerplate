import { BaseModel } from '@models/Hierarchy'
import { Database } from '@vuex-orm/core'

const database = new Database()

database.register(BaseModel)

export default database
