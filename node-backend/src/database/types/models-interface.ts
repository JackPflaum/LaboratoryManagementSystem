import Client from '../models/Client';
import Job from '../models/Job';
import Profile from '../models/Profile';
import Sample from '../models/Sample';
import SamplePhoto from '../models/SamplePhoto';
import Test from '../models/Test';
import User from '../models/User';

export interface ModelsInterface {
    Client: typeof Client;
    Job: typeof Job;
    Profile: typeof Profile;
    Sample: typeof Sample;
    SamplePhoto: typeof SamplePhoto;
    Test: typeof Test;
    User: typeof User;
}