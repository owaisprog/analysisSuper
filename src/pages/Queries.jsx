import React, { useEffect, useState } from 'react';
import AllAdmins from '../components/homepage/AllAdmins';
import SuperAdminNavbar from '../components/homepage/SuperAdminNavbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AllQueries from '../components/AllQueries';

function Queries() {
    const [queries,setQueries] = useState(0) 

    const navigate = useNavigate();

    useEffect(() => {
        const SuperToken = Cookies.get('SuperToken');
        if (!SuperToken) {
            navigate('/Login');
        }else{
            fetchQueries()
        }
    }, [navigate]);

    const fetchQueries = async () => {
      try {
        const response = await axios.get(
          "https://api.talentspy.ai/api/numberOfAllMessages"
        );
        setQueries(response.data);
      } catch (error) {
      }
    };


    return (
        <div>

            <div>
                <SuperAdminNavbar queries={queries}/>
            </div>

            <div>
                <AllQueries />
            </div>

        </div>
    );
}

export default Queries