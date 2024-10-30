import React, { useEffect, useState } from 'react';
import AllAdmins from '../components/homepage/AllAdmins';
import SuperAdminNavbar from '../components/homepage/SuperAdminNavbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Home() {


    const navigate = useNavigate();

    useEffect(() => {
        const SuperToken = Cookies.get('SuperToken');
        console.log(SuperToken)
        if (!SuperToken) {
            navigate('/Login');
        }
    }, [navigate]);


    return (
        <div>

            <div>
                <SuperAdminNavbar />
            </div>

            <div>
                <AllAdmins />
            </div>

        </div>
    );
}

export default Home;
