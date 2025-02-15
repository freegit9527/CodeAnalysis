# -*- encoding: utf-8 -*-
# Copyright (c) 2021-2022 THL A29 Limited
#
# This source code file is made available under MIT License
# See LICENSE for details
# ==============================================================================

""" http client
"""

import json
import logging

from urllib.parse import urljoin
from util.wrapper import SyncWrapper, Retry
from urllib.request import Request, urlopen
from urllib.error import HTTPError


logger = logging.getLogger(__name__)


class HttpRequest(object):
    @staticmethod
    def request(url, headers, param=None, body=None, method="POST"):
        """

        :param url:
        :param headers:
        :param param:
        :param body:
        :param method:
        :return:
        """
        if param:
            url += "?" + param
        if body and isinstance(body, str):
            body = body.encode("utf-8")

        try:
            req = Request(url=url, data=body, headers=headers)
            req.get_method = lambda: method.upper()
            response = urlopen(req).read()
            str_result = response.decode("utf8")
            dict_result = json.loads(str_result)
            return dict_result
        except HTTPError as err:
            logger.error(f"error code: {err.code}, reason: {err.reason}, headers: {err.headers}")
            raise


class HttpClient(object):
    def __init__(self, server_url, rel_url, headers=None, data=None, json_data=None, proxies=None):
        """

        :param server_url:
        :param rel_url:
        :param headers:
        :param data:
        :param json_data:
        :param proxies:
        """
        self.url = urljoin(server_url, rel_url)
        self.headers = headers
        if data:
            self.data = data
        elif json_data:
            self.data = json.dumps(json_data)
        else:
            self.data = None
        self.proxies = proxies

    def get(self, params=None):
        result = HttpRequest.request(url=self.url, headers=self.headers, param=params, body=self.data, method="GET")
        return result

    def post(self):
        result = HttpRequest.request(url=self.url, headers=self.headers, body=self.data, method="POST")
        return result

    def put(self):
        result = HttpRequest.request(url=self.url, headers=self.headers, body=self.data, method="PUT")
        return result


class RetryHttpClient(object):
    """
    直接调用RestfulAPI的重试类
    """
    def __retry_on_error(self, error, method_name):
        """
        失败重试函数
        :param error:
        :return:
        """
        err_msg = str(error)

        # 直接抛异常
        if "License is not valid!" in err_msg:
            raise

        # 重试直到成功为止
        return

    def get_api_server(self, server_url, rel_url, headers=None, data=None, json_data=None,
                       proxies=None, interval=5, retry_times=-1):
        """
        返回RestfulAPI的重试wrap类
        :param server_url:
        :param rel_url:
        :param headers:
        :param data:
        :param json_data:
        :param proxies:
        :param interval:
        :param retry_times:
        :return:
        """
        api_server = HttpClient(server_url, rel_url, headers, data, json_data, proxies)
        return SyncWrapper(Retry(server=api_server, on_error=self.__retry_on_error,
                                 interval=interval, total=retry_times))
