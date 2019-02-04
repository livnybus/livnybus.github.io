#include <iostream>
#include <vector>
using namespace std;

int main() {
  str s;
  vector<string> names;
  vector< vector<string> > times;  

  getline(cin, s);
  int linenum = 1;
  while(getline(cin, s)) {
    int p = 0;
    while (p < s.size() && s[p] != ',') p++;
    if (p == s.size() && p == 0) {
      cout << "ERR: not found , on " << linenum << endl;
      return 0;
    }

    names.push_back(str.substr(0, p));
    p++;

    times.push_back(vector<string>());

    bool wait_minus = true;
    
    while (p < str.size()) {
      
    }

    

    linenum++;
  }
}