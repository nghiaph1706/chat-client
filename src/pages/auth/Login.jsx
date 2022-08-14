import './auth.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    let navigate = useNavigate()
    const [user, setUser] = useState({})

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUser(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (user.username === '' || user.password === '') {
            alert('Error')
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            };
            const res = await fetch('http://localhost:8080/login', requestOptions)
            if (res.status === 404)
                return alert(`code: ${res.status}\nerror: ${res.statusText}`)
            const rs = await res.json()
            sessionStorage.setItem('userId', rs.userId)
            alert('Login success')
            navigate('/messenger')
        }
    }


    return (
        <>
            <div class="container h-100">
                <div class="row h-100">
                    <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                        <div class="d-table-cell align-middle">
                            <div class="card">
                                <div class="card-body">
                                    <div class="m-sm-4">
                                        <form onSubmit={handleSubmit}>
                                            <div class="form-group">
                                                <label>Username</label>
                                                <input class="form-control form-control-lg" type="text" name="username" placeholder="Enter your username" onChange={handleChange} />
                                            </div>
                                            <div class="form-group">
                                                <label>Password</label>
                                                <input class="form-control form-control-lg" type="password" name="password" placeholder="Enter your password" onChange={handleChange} />
                                            </div>
                                            <div class="text-center mt-3">
                                                <button type="submit" class="btn btn-lg btn-primary">Sign in</button><br></br>
                                                <small>
                                                    <a href="/signup">Create an Account?</a>
                                                </small>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}