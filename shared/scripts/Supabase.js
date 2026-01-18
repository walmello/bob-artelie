import { createClient } from '@supabase/supabase-js'
import { profiles, courses } from './Baserow'
import config from './config'

const supabase = createClient(config.supabase.url, config.supabase.anon_key)

class Auth {
    async login(email, password){
        const {data, error} = await supabase.auth.signInWithPassword({ email, password })
        return error || data
    }
    
    async logout(){
        await supabase.auth.signOut();
    }
    
    async signUp(name, email, password){
        const { data, error } = await supabase.auth.signUp({ email, password, options: {
            data: { name }
        } })
        console.log(data.user)
        return error || data
    }
    
    async recoverPassword(email){
        const { data, error } = await supabase.auth.resetPasswordForEmail(email)
        return error || data
    }    
    
    async session(){
        const { data, error } = await supabase.auth.getSession()
        return error || data.session
    }
}

export class User {
    constructor(){
        this.authenticated = false
        this.profile = null
        this.init()
    }
    
    async init(){
        this.user = await this.get()
        if(this.user){
            this.authenticated = true
            this.data = await this.get()
            this.profile = await this.getProfile()    
            this.courses = await this.getCourses()
            this.certifications = await this.getCertifications() 
        }
        return this
    }

    async function(api){
        const { data: { session : { access_token: token } } } = await supabase.auth.getSession();
        const endpoint = `https://seqolypxaaqyrwzcwktp.supabase.co/functions/v1/${api}`
        
        const res = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        const data = await res.json();
        return data
    }
    
    async get(){
        const { data: { user }, error } = await supabase.auth.getUser()
        if(error) console.log(error)
            return user
    }
    
    async hasCourse(id){
        const has = await user.profile['Cursos Adquiridos'].some(c => c.id == id)
        return has
    }

    async getCourse(id){
        return await courses.get(id)
    }
    
    async getCourses(){
        let coursesList = (await courses.getByUserId(this.profile.id)).results
        return coursesList
        /*
        let coursesList = JSON.parse(localStorage.getItem('courses'))
        console.log(coursesList)
        localStorage.setItem('courses', JSON.stringify(coursesList))
        return coursesList
        if(coursesList){
        return coursesList
        } else {
            coursesList = (await courses.getByUserId(this.profile.id)).results
        console.log(coursesList)
        localStorage.setItem('courses', JSON.stringify(coursesList))
        return coursesList
        }
        */
    }
    
    async getCertifications(){
        let coursesList = JSON.parse(localStorage.getItem('certifications'))
        if(coursesList){
            return coursesList
        } else {
            if(!this.profile?.id) return []
            coursesList = (await courses.getByUserId(this.profile.id, 'Certificados')).results
            localStorage.setItem('certifications', JSON.stringify(coursesList))
            return coursesList
        }
    }
    
    
    async getProfile(){
        const { data: { session: {access_token} }, error } = await supabase.auth.getSession();
        const users = profiles(access_token) 
        const user = await this.get()
        
        let profile = localStorage.getItem('profile')
        
        if(profile){
            return JSON.parse(profile)
        } else {
            profile = await users.request({
                query: {
                    user_field_names: true,
                    filter__supabase_id__equal: user.id
                }
            }) 
            
            if(profile.results.length > 0){
                localStorage.setItem('profile', JSON.stringify(profile.results[0]))
                return profile.results[0]
            } else {
                const request = await users.request({
                    method: 'POST',
                    body: {
                        supabase_id: user.id,
                        Nome: user.data.user_metadata.name
                    }
                })
                localStorage.setItem('profile', JSON.stringify(request))
                return request
            }
        }
    }
    
    async authenticated(){
        return !(await this.get() instanceof Error)
    }
    
    async update(data){
        const { result, error } = await supabase.auth.updateUser({ data })
        return error || result
    }
    
    static async login(email, password){
        const {data, error} = await supabase.auth.signInWithPassword({ email, password })
        return error || data
    }
    
    async logout(){
        localStorage.clear();
        await supabase.auth.signOut();
    }
    
    async signUp(name, email, password){
        const { data, error } = await supabase.auth.signUp({ email, password })
        const users = new Table('794809', this.baserow)
        if(!error) {
            users.create({
                "supabase_id": this.id,
                "Nome": name
            })
        }
        return error || data
    }
    
    async recoverPassword(email){
        const { data, error } = await supabase.auth.resetPasswordForEmail(email)
        return error || data
    }
}

export const user = new User()
export const auth = new Auth()