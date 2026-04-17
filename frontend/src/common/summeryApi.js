export const baseURL = "http://localhost:8000"

const summeryApi = {
    register:{
        url:"/api/auth/register-company",
        method:"post"
    },
    login:{
        url:"/api/auth/login",
        method:"post"
    },
    verifyAccount:{
        url:"/api/auth/verify-account",
        method:"post"
    },
    changePassword:{
        url:"/api/auth/change-password",
        method:"patch"
    },
    userDetails:{
        url:"/api/auth/me",
        method:"get"
    },
    addPersonnel:{
        url:"/api/auth/users",
        method:"post"
    },
    getUsers:{
        url:"/api/auth/users",
        method:"get"
    },
    createProject:{
        url:"/api/projects",
        method:"post"
    },
    getProjects:{
        url:"/api/projects",
        method:"get"
    },
    deleteProject:{
        url:"/api/projects",
        method:"delete"
    },
    reports:{
        url:"/api/reports",
        method:"post"
    }
}

export default summeryApi