$server = "dbcourse.cs.smu.ca"
$user = "u72"
$api_ver = 0.1.0
ssh-keyscan $server >> ~/.ssh/known_hosts
ssh -i ./dbcourse.pem $user@$server "rm -rf ~/public_html/*"
scp -i ./dbcourse.pem -r "../client/dist/{.*,*}" $user@$($server):~/public_html
scp -i ./dbcourse.pem -r "../api/dist/api-$api_ver.tar.gz" $user@$($server):~/project_api
ssh -i ./dbcourse.pem $user@$server "cd ~/project_api && rm -rf api && tar -xzvf api-`$($api_ver).tar.gz && cd api && pip install -r requirements.txt"