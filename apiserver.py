# very simple RPC server in python
import sys, json, os
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse as urlparse
import threading
import logging

# @var {String}
log = logging.getLogger(__name__)
# @var {String}
responseHeader = "text/html"
# @var {Boolean}
responseByteBool = False
# @var {String}
assetsPath = '/_/assets/'


class ApiError(Exception):
    def __init__(self, code, msg=None, desc=None):
        self.code = code
        self.msg = msg
        self.desc = desc

    def __str__(self):
        return f"ApiError({self.code}, {self.msg})"

class UserErrors():
    def __init__(self):
        self.errors = []
    def setError(self,error):
        self.errors.append(error)
    def getErrors(self):
        return self.errors
    def clearErrors(self):
        self.errors = []

def ApiRoute(path):
    def outer(func):
        if not hasattr(func, "_routes"):
            setattr(func, "_routes", [])
        func._routes = [path]
        return func
    return outer

class ApiServer(HTTPServer):
    def __init__(self, addr, port):
        """
        Create a new server on address, port.  Port can be zero.
        from apiserver import ApiServer, ApiError, ApiRoute
        Create your handlers by inheriting from ApiServer and tagging them with @ApiRoute("/path").
        Alternately you can use the ApiServer() directly, and call add_handler("path", function)
        Raise errors by raising ApiError(code, message, description=None)
        Return responses by simply returning a dict() or str() object
        Parameter to handlers is a dict()
        Query arguments are shoved into the dict via urllib.parse_qs
        """
        server_address = (addr, port)
        self.__addr = addr

        # instead of attempting multiple inheritence

        # shim class that is an ApiHandler
        class handler_class(ApiHandler):
            pass

        self.handler_class = handler_class

        # routed methods map into handler
        for meth in type(self).__dict__.values():
            if hasattr(meth, "_routes"):
                for route in meth._routes:
                    self.add_route(route, meth)

        super().__init__(server_address, handler_class)

    def add_route(self, path, meth):
        self.handler_class._routes[path] = meth
        
    def port(self):
        "Get my port"
        sa = self.socket.getsockname()
        return sa[1]

    def address(self):
        "Get my ip address"
        sa = self.socket.getsockname()
        return sa[0]

    def uri(self, path):
        "Make a URI pointing at myself"
        if path[0] == "/":
            path = path[1:]
        return "http://"+self.__addr + ":"+ str(self.port()) + "/" + path

    def shutdown(self):
        super().shutdown()
        self.socket.close()

class ApiHandler(BaseHTTPRequestHandler):
    # @var {dict}
    _routes={}
    '''

    '''
    def do_GET(self):
        self.do_XXX()
    '''

    '''
    def do_POST(self):
        content="{}"
        if self.headers["Content-Length"]:
            length = int(self.headers["Content-Length"])
            content=self.rfile.read(length).decode('utf-8')
        info=None
        if content:
            info = content
            info = urlparse.parse_qs(info)
        self.do_XXX(info)
    '''

    '''
    def do_XXX(self, info={}):
        global responseHeader
        global responseByteBool

        try:
            url=urlparse.urlparse(self.path)

            handler = self._routes.get(url.path)

            if url.query:
                params = urlparse.parse_qs(url.query)
            else:
                params = {}
            '''
            if(info==None):
                info = params
            else:
                info.update(params)
            '''
            info = params
            if handler:
                try:
                    response=handler(info)
                    self.send_response(200)
                    if response is None:
                        response = ""
                    if type(response) is dict:
                        response = json.dumps(response)
                    if True == responseByteBool:
                        self.send_header("Accept-Ranges", "bytes")
                    else:
                        response = bytes(str(response),"utf-8")

                    responseByteBool = False

                    self.send_header("Content-Length", len(response))
                    self.send_header("Content-Type", responseHeader)
                    self.end_headers()
                    self.wfile.write(response)
                except ApiError:
                    raise
                except ConnectionAbortedError as e:
                    log.error(f"GET {self.path} : {e}")
                except Exception as e:
                    raise ApiError(500, str(e))
            else:
                raise ApiError(404)
        except ApiError as e:
            try:
                self.send_error(e.code, e.msg, e.desc)
            except ConnectionAbortedError as e:
                log.error(f"GET {self.path} : {e}")
'''
    @param {class}
'''
class MyServer(ApiServer): 
        @ApiRoute("/ajax")
        def ajax(req):
            global responseHeader
            responseHeader="application/json"
            try:
                method = req["method"]
                result = globals()[method[0]](req)
                _return = {}
                if False == result:
                    _return["success"] = 0
                    _return["errors"] = userErrors.getErrors()
                    userErrors.clearErrors()
                else:
                    _return["success"] = 1
                    _return["message"] = result
                return json.dumps(_return)
            except Exception as e:
                raise ApiError(500, str(e))

        @ApiRoute("/")
        def home(req):
            global responseHeader
            responseHeader="text/html"
            return GetFile('/html/index.html')
        @ApiRoute("/js")
        def getjs(req):
            global responseHeader
            responseHeader="application/javascript"
            file = assetsPath+"js/"
            if 'file' in req:
                file = file + req["file"][0]
            return GetFile(file)
        @ApiRoute("/css")
        def getcss(req):
            global responseHeader
            responseHeader="text/css"
            file = assetsPath + "css/"
            if 'file' in req:
                file = file + req["file"][0]
            return GetFile(file)
        @ApiRoute("/img")
        def getimg(req):
            global responseHeader
            global responseByteBool
            responseByteBool = True

            file = assetsPath + "images/"
            if 'file' in req:
                file = file + req["file"][0]
                ext = os.path.splitext(req["file"][0])[1]
                if ext == ".jpg":
                    responseHeader="image/jpeg"
                elif ext == ".jpeg":
                    responseHeader="image/jpeg"
                elif ext == ".gif":
                    responseHeader="image/gif"
                elif ext == ".png":
                    responseHeader="image/png"
            return GetFile(file,True)
        @ApiRoute("/font")
        def getfont(req):
            global responseHeader
            global responseByteBool
            responseByteBool = True

            responseHeader="text/plain"
            file = assetsPath + "font/"
            if 'file' in req:
                file = file + req["file"][0]
            return GetFile(file,True)
        @ApiRoute("/file")
        def getfile(req):
            global responseHeader
            responseHeader="text/plain"
            file = "/"
            if 'file' in req:
                file = file + req["file"][0]
            return GetFile(file)
'''
    @param {string}
'''
def GetFile(path, binary = False):
    mode = 'r'
    if True == binary:
        mode = 'rb'

    path = os.getcwd()+path
    if os.path.isfile(path):
        file = open(path,mode)
        return file.read()
    else:
        raise ApiError(404)

'''
    AJAX FUNCTIONS
'''

def test(req):
    if req.get("name")==None:
        userErrors.setError("name is a required field")
        return False
    return "Hello "+req["name"][0]+", this response came for the server"

userErrors = UserErrors()

MyServer("127.0.0.1",35730).serve_forever()


