# Linux Command Cheat Sheet for QA / SDET / Automation / Performance Engineers

> **Purpose:** A practical Linux reference designed around day-to-day QA
> work: navigating servers, validating deployments, inspecting logs,
> testing APIs, checking processes and ports, debugging
> Docker/Kubernetes, and investigating performance issues.

------------------------------------------------------------------------

## 1. Directory Navigation

  -----------------------------------------------------------------------
  Command                 What it does            QA / SDET example
  ----------------------- ----------------------- -----------------------
  `pwd`                   Shows the current       Confirm whether you are
                          working directory       in `/opt/app/logs`
                                                  before checking logs

  `ls`                    Lists files and         List test artifacts or
                          directories             log files

  `ls -l`                 Detailed listing with   Check whether a test
                          permissions, owner,     report was generated
                          size, date              

  `ls -a`                 Includes hidden files   Find `.env`, `.git`, or
                                                  hidden config files

  `ls -lh`                Human-readable file     Quickly identify a very
                          sizes                   large log

  `cd folder`             Enters a child          `cd logs`
                          directory               

  `cd ..`                 Goes up one directory   From `/opt/app/logs` to
                                                  `/opt/app`

  `cd ../..`              Goes up two levels      From `/opt/app/logs` to
                                                  `/opt`

  `cd ../../..`           Goes up three levels    Move several levels
                                                  upward

  `cd .`                  Refers to the current   Useful in paths such as
                          directory               `find .`

  `cd ~`                  Goes to your home       Return to
                          directory               `/home/<user>`

  `cd /`                  Goes to filesystem root Start navigation from
                                                  `/`

  `cd -`                  Returns to the previous Switch quickly between
                          directory               two locations
  -----------------------------------------------------------------------

### Folder-level example

Assume you are here:

``` text
/home/qa/projects/api-tests/reports
```

``` bash
cd .              # Stay in reports
cd ..             # /home/qa/projects/api-tests
cd ../..          # /home/qa/projects
cd ../../..       # /home/qa
cd /              # Root directory
cd ../logs        # Go up one level, then enter logs
```

**Remember:** `.` = current directory, `..` = parent directory, `/` =
root directory, `~` = home directory.

------------------------------------------------------------------------

## 2. File & Directory Operations

  -----------------------------------------------------------------------------
  Command                       Purpose                 QA use
  ----------------------------- ----------------------- -----------------------
  `touch test.log`              Create an empty file    Create a
                                                        placeholder/log file

  `mkdir reports`               Create directory        Create test-report
                                                        folder

  `mkdir -p reports/api/run1`   Create nested           Prepare automation
                                directories             output structure

  `cp file1 file2`              Copy file               Back up a config before
                                                        editing

  `cp -r dir1 dir2`             Copy directory          Copy test artifacts
                                recursively             

  `mv old new`                  Move or rename          Rename an old report

  `rm file.txt`                 Delete file             Remove unwanted
                                                        artifact

  `rm -r folder`                Delete directory        Remove old results
                                recursively             

  `rm -rf folder`               Force recursive         Cleanup; **use with
                                deletion                extreme care**

  `cat file.txt`                Print entire file       Read small config/log
                                                        files

  `less file.txt`               Scroll through a file   Inspect large logs
                                                        safely

  `head file.txt`               First 10 lines          Inspect beginning of a
                                                        log

  `head -50 file.txt`           First 50 lines          Inspect startup
                                                        messages

  `tail file.txt`               Last 10 lines           Check latest log
                                                        entries

  `tail -100 app.log`           Last 100 lines          Investigate recent
                                                        failure

  `tail -f app.log`             Follow new lines live   Monitor logs during
                                                        test execution
  -----------------------------------------------------------------------------

**QA caution:** Always run `pwd` and `ls` before destructive commands
such as `rm -rf`.

------------------------------------------------------------------------

## 3. Finding Files

``` bash
find . -name "*.log"               # Find .log files below current directory
find . -name "*.json"              # Find JSON files
find . -name "*.xml"               # Find XML reports
find . -iname "*report*"           # Case-insensitive filename search
find /opt/app -name "app.log"      # Search inside a specific application path
find . -type f -mtime -1           # Files modified in the last 24 hours
find . -type f -size +100M         # Files larger than 100 MB
```

### QA scenario

``` bash
find . -name "*.log"
```

Use this when a failed CI/deployment created logs but you do not know
their exact directory.

------------------------------------------------------------------------

## 4. Searching Inside Files with `grep`

``` bash
grep "ERROR" app.log                   # Find ERROR
grep -i "timeout" app.log              # Case-insensitive search
grep -n "Exception" app.log            # Include line numbers
grep -r "payment" .                    # Recursive search
grep -c "ERROR" app.log                # Count matching lines
grep -E "ERROR|WARN" app.log           # Match ERROR or WARN
grep -v "INFO" app.log                 # Exclude INFO lines
grep -A 5 "Exception" app.log          # Show 5 lines after match
grep -B 5 "Exception" app.log          # Show 5 lines before match
grep -C 5 "Exception" app.log          # Show 5 lines before and after
grep "2026-08-25" app.log | grep ERROR # Errors on a specific date
```

### QA failure investigation

``` bash
grep -n -E "ERROR|Exception|FAIL" app.log
```

Useful for quickly locating likely application/test failures.

------------------------------------------------------------------------

## 5. Pipes `|` and Redirection

A pipe sends the output of one command into another command.

``` bash
grep ERROR app.log | wc -l
ps -ef | grep java
cat response.json | jq
```

### Output redirection

``` bash
command > output.txt       # Write output; overwrite file
command >> output.txt      # Append output
command 2> errors.txt      # Redirect errors
command > all.txt 2>&1     # Redirect output + errors
```

### QA example

``` bash
grep ERROR app.log > failed_errors.txt
```

Save errors for a defect attachment or investigation.

------------------------------------------------------------------------

## 6. Sorting, Unique Values & Counting

``` bash
sort users.txt
sort -r users.txt
sort users.txt | uniq
sort users.txt | uniq -c
wc -l file.txt
wc -w file.txt
wc -c file.txt
grep ERROR app.log | wc -l
```

### QA example --- count unique HTTP status codes

``` bash
awk '{print $9}' access.log | sort | uniq -c
```

------------------------------------------------------------------------

## 7. Process Management

``` bash
ps -ef
ps -ef | grep java
ps -ef | grep node
pgrep -af java
top
htop
kill PID
kill -9 PID
```

### QA scenario --- application appears down

``` bash
ps -ef | grep java
```

If no expected application process exists, the service may not be
running.

**Use `kill -9` only when normal termination does not work.**

------------------------------------------------------------------------

## 8. Disk & Memory Checks

``` bash
df -h                 # Filesystem usage
du -sh reports        # Size of reports directory
du -sh *              # Size of items in current directory
free -h               # RAM and swap usage
```

### QA scenarios

``` bash
df -h
```

Check whether a test failed because the server disk is full.

``` bash
du -sh logs/*
```

Identify which log folder is consuming disk space.

------------------------------------------------------------------------

## 9. File Permissions

``` bash
ls -l
chmod +x run-tests.sh
chmod 755 run-tests.sh
chmod 644 config.json
```

Typical interpretation:

``` text
r = read
w = write
x = execute
```

QA example:

``` bash
chmod +x run-tests.sh
./run-tests.sh
```

Use when an automation shell script returns **Permission denied**.

------------------------------------------------------------------------

## 10. Networking & Connectivity

``` bash
ip addr
ping example.com
curl https://example.com
curl -I https://example.com
ss -tuln
ss -ltnp
```

`ifconfig` and `netstat` are older/legacy commands and may not be
installed on modern systems.

### QA connectivity flow

``` bash
ping api.example.com
curl -I https://api.example.com
ss -ltnp
```

This helps distinguish DNS/network problems, HTTP availability problems,
and local port/listener problems.

------------------------------------------------------------------------

## 11. API Testing with `curl`

### GET

``` bash
curl https://api.example.com/users
```

### Show response headers

``` bash
curl -i https://api.example.com/users
```

### Headers only

``` bash
curl -I https://example.com
```

### POST JSON

``` bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"QA User"}' \
  https://api.example.com/users
```

### Authorization header

``` bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/users
```

### Save response

``` bash
curl -o response.json https://api.example.com/users
```

### Verbose troubleshooting

``` bash
curl -v https://api.example.com
```

------------------------------------------------------------------------

## 12. HTTP Status Validation

``` bash
curl -s -o /dev/null -w "%{http_code}\n" https://example.com
```

Typical QA interpretation:

     Code Meaning
  ------- --------------------------------
    `200` Request successful
    `201` Resource created
    `204` Successful, no response body
    `400` Bad request
    `401` Authentication required/failed
    `403` Forbidden
    `404` Resource not found
    `409` Conflict
    `500` Server-side error
    `502` Bad gateway
    `503` Service unavailable
    `504` Gateway timeout

------------------------------------------------------------------------

## 13. Environment Variables

``` bash
env
printenv
echo $PATH
echo $JAVA_HOME
export TOKEN=123
echo $TOKEN
unset TOKEN
```

QA / automation example:

``` bash
export BASE_URL="https://qa.example.com"
export API_TOKEN="test-token"
```

Then:

``` bash
curl -H "Authorization: Bearer $API_TOKEN" "$BASE_URL/users"
```

Avoid printing real secrets in shared logs.

------------------------------------------------------------------------

## 14. Log Analysis

``` bash
tail -100 app.log
tail -f app.log
grep ERROR app.log
grep -E "ERROR|WARN" app.log
grep Exception app.log
grep -n -C 5 "NullPointerException" app.log
```

### Follow only errors live

``` bash
tail -f app.log | grep --line-buffered ERROR
```

### Count failures

``` bash
grep -c "FAILED" automation.log
```

### QA investigation pattern

``` bash
grep -n "Order ID: 12345" app.log
grep -n -C 10 "Order ID: 12345" app.log
```

------------------------------------------------------------------------

## 15. JSON Processing with `jq`

``` bash
jq . response.json
jq '.status' response.json
jq '.user.name' response.json
jq '.users[]' response.json
jq '.users[].id' response.json
jq '.users[] | select(.status=="ACTIVE")' response.json
```

### API + JSON together

``` bash
curl -s https://api.example.com/users | jq .
```

``` bash
curl -s https://api.example.com/users | jq '.users[].id'
```

Very useful for API automation/debugging.

------------------------------------------------------------------------

## 16. SSH & File Transfer

``` bash
ssh user@hostname
ssh user@192.168.1.20
scp report.txt user@server:/tmp/
scp -r reports/ user@server:/tmp/
scp user@server:/var/log/app.log .
```

QA uses:

-   Login to QA/UAT servers
-   Retrieve server logs
-   Upload test data
-   Copy test reports/artifacts

------------------------------------------------------------------------

## 17. Compression & Archives

``` bash
zip report.zip report.txt
zip -r reports.zip reports/
unzip report.zip
tar -czf logs.tar.gz logs/
tar -xzf logs.tar.gz
tar -tzf logs.tar.gz
```

QA example:

``` bash
tar -czf failed-test-logs.tar.gz logs/
```

Useful when attaching many logs to a defect.

------------------------------------------------------------------------

## 18. Docker Debugging

``` bash
docker ps
docker ps -a
docker images
docker logs container-id
docker logs -f container-id
docker logs --tail 100 container-id
docker exec -it container-id bash
docker inspect container-id
docker stop container-id
docker start container-id
docker restart container-id
docker rm container-id
```

### QA Docker investigation

``` bash
docker ps
docker logs --tail 100 my-api
docker logs -f my-api
docker exec -it my-api bash
```

------------------------------------------------------------------------

## 19. Kubernetes Debugging

``` bash
kubectl get pods
kubectl get pods -A
kubectl get svc
kubectl get ns
kubectl get deployments
kubectl logs pod-name
kubectl logs -f pod-name
kubectl logs --previous pod-name
kubectl describe pod pod-name
kubectl exec -it pod-name -- bash
kubectl get events
kubectl delete pod pod-name
```

With namespace:

``` bash
kubectl get pods -n qa
kubectl logs api-pod -n qa
kubectl describe pod api-pod -n qa
```

### Common QA flow

``` bash
kubectl get pods -n qa
kubectl describe pod api-pod -n qa
kubectl logs api-pod -n qa
```

Use this sequence when a deployment is unhealthy or API tests suddenly
fail.

------------------------------------------------------------------------

## 20. Performance Monitoring

``` bash
top
free -h
df -h
iostat
vmstat 1
ss -s
uptime
```

Useful interpretation:

  Command      Check
  ------------ ---------------------------------------
  `top`        CPU, memory, processes
  `free -h`    RAM and swap
  `df -h`      Disk capacity
  `iostat`     CPU + disk I/O
  `vmstat 1`   CPU, memory, processes, I/O over time
  `ss -s`      Socket/network summary
  `uptime`     Uptime and load averages

Performance engineers should correlate server metrics with load-test
timestamps rather than judging one metric in isolation.

------------------------------------------------------------------------

## 21. Service & Port Troubleshooting

``` bash
systemctl status service-name
systemctl start service-name
systemctl stop service-name
systemctl restart service-name
journalctl -u service-name
journalctl -u service-name -f
ss -ltnp
```

Example:

``` bash
systemctl status nginx
ss -ltnp | grep :8080
```

Useful when automation reports **connection refused**.

------------------------------------------------------------------------

## 22. Combining Commands --- QA Examples

### Count errors

``` bash
grep ERROR app.log | wc -l
```

### Find Java process

``` bash
ps -ef | grep java
```

### Top client IPs

``` bash
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head
```

### Find errors for a specific date

``` bash
grep "2026-08-25" app.log | grep ERROR
```

### Find HTTP 500 requests

``` bash
grep ' 500 ' access.log
```

### Count HTTP 500 requests

``` bash
grep ' 500 ' access.log | wc -l
```

### Find largest files

``` bash
find . -type f -printf '%s %p\n' | sort -nr | head
```

------------------------------------------------------------------------

## 23. Terminal Productivity Shortcuts

  Shortcut / Command   Purpose
  -------------------- ----------------------------------
  `Ctrl + C`           Stop current foreground command
  `Ctrl + L`           Clear screen
  `Ctrl + R`           Search command history
  `Ctrl + A`           Move cursor to beginning of line
  `Ctrl + E`           Move cursor to end of line
  `Ctrl + U`           Delete from cursor to beginning
  `Ctrl + K`           Delete from cursor to end
  `Tab`                Auto-complete command/path
  `history`            Show command history
  `!!`                 Run previous command
  `clear`              Clear terminal

------------------------------------------------------------------------

## 24. QA / SDET Troubleshooting Playbooks

### A. Test says API is down

``` bash
ping api.example.com
curl -v https://api.example.com/health
ss -ltnp
ps -ef | grep java
```

### B. Automation failed --- inspect logs

``` bash
tail -100 automation.log
grep -n -E "ERROR|FAIL|Exception" automation.log
```

### C. Server disk is full

``` bash
df -h
du -sh /var/log/*
```

### D. Application is running but API fails

``` bash
ps -ef | grep java
ss -ltnp | grep :8080
curl -v http://localhost:8080/health
```

### E. Kubernetes test environment failure

``` bash
kubectl get pods -n qa
kubectl describe pod <pod-name> -n qa
kubectl logs <pod-name> -n qa
```

### F. Dockerized application failure

``` bash
docker ps -a
docker logs --tail 100 <container>
docker inspect <container>
```

------------------------------------------------------------------------

## 25. Command Safety --- Important for QA Engineers

Be especially careful with:

``` bash
rm -rf
kill -9
chmod -R
chown -R
kubectl delete
docker rm
```

Before destructive commands, verify:

``` bash
pwd
ls
```

In shared QA/UAT environments, confirm the target host, namespace,
container, directory, and process before modifying or deleting anything.

------------------------------------------------------------------------

# QA / SDET Quick Reference

  QA Task                Go-to command
  ---------------------- ------------------------------------------------
  Where am I?            `pwd`
  List files             `ls -lh`
  Find logs              `find . -name "*.log"`
  Search errors          `grep -n -E "ERROR|Exception|FAIL" app.log`
  Monitor logs           `tail -f app.log`
  Count errors           `grep ERROR app.log \| wc -l`
  Test API               `curl -v URL`
  Check HTTP status      `curl -s -o /dev/null -w "%{http_code}\n" URL`
  Parse JSON             `jq`
  Check process          `ps -ef \| grep java`
  Check port             `ss -ltnp`
  Check disk             `df -h`
  Check memory           `free -h`
  Login to server        `ssh user@host`
  Copy logs              `scp`
  Docker logs            `docker logs -f <container>`
  Kubernetes logs        `kubectl logs -f <pod>`
  Kubernetes diagnosis   `kubectl describe pod <pod>`
  Service status         `systemctl status <service>`
  Performance            `top`, `vmstat`, `iostat`

------------------------------------------------------------------------

# Suggested SDET Masterclass Practice Order

1.  Navigation and paths
2.  Files and directories
3.  `cat`, `less`, `head`, `tail`
4.  `find`
5.  `grep`
6.  Pipes and redirection
7.  `sort`, `uniq`, `wc`, `awk`
8.  Processes
9.  Disk and memory
10. Permissions
11. Networking and ports
12. `curl` API testing
13. Environment variables
14. Log investigation
15. `jq`
16. SSH / SCP
17. Docker
18. Kubernetes
19. Performance monitoring
20. QA troubleshooting scenarios

> **Learning goal:** Do not memorize every option. Learn which command
> answers which troubleshooting question, then practice combining
> commands during realistic QA incidents.
