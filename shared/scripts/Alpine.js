import { user as u, auth } from "./Supabase.js"

export const user = () => ({
    path: window.location.pathname.replace(/\/$/, "") || "/",
    user: {},
    async init(){
        this.user = await u.init()
        console.log(this.user)
        if(!this.user.authenticated){
            const path = window.location.pathname.replace(/\/$/, "") || "/"
            if(path !== '/login' && path !== '/criar-conta'){
                window.location.href = '/login'
            }
            /*
            if(window.location.pathname !== '/login' && window.location.pathname !== '/criar-conta'){
                window.location.href = '/login'
            }
            */
        }
    }
})

export const login = () => ({
    email: {
        input: '',
        feedback: []
    },
    password: {
        input: '',
        feedback: []
    },
    validate(){
        this.email.feedback = []
        this.password.feedback = []
        
        if (!this.email.input) this.email.feedback.push('digite um email')
            if (!this.password.input) this.password.feedback.push('digite uma senha')
                
        if (this.email.feedback.lenght > 0) return false
        if (this.password.feedback.lenght > 0) return false
        else return true
    },
    
    async submit(){
        const validation = await this.validate()
        const login = await auth.login(this.email.input, this.password.input)
        if(!(login instanceof Error)){
            window.location.href = '/'
        } else {
            console.log(login)
        }
    }
})

export const register = () => ({
    name: {
        input: '',
        feedback: []
    },
    email: {
        input: '',
        feedback: []
    },
    password: {
        input: '',
        feedback: []
    },
    confirm: {
        input: '',
        feedback: []
    },
    accept: false,
    
    validate(){
        this.name.feedback = []
        this.email.feedback = []
        this.password.feedback = []
        this.confirm.feedback = []
        
        if (!this.name.input) this.name.feedback.push('digite um nome')
            if (!this.email.input) this.email.feedback.push('digite um email')
                if (!this.password.input) this.password.feedback.push('digite uma senha')
                    if (!this.confirm.input) this.confirm.feedback.push('confirme a senha')
                        if (this.password.input !== this.confirm.input) this.confirm.feedback.push('as senhas não são iguais')
                            
        if (this.name.feedback.length > 0) return false
        if (this.email.feedback.length > 0) return false
        if (this.password.feedback.length > 0) return false
        if (this.confirm.feedback.length > 0) return false
        else return true
    },
    
    async submit(){
        const validation = this.validate()        
        const signUp = auth.signUp(this.name.input, this.email.input, this.password.input)
        if(!(signUp instanceof Error)){
            window.location.href = '/'
        } else {
            console.log(login)
        }        
    }
})