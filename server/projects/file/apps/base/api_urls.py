# -*- coding: utf-8 -*-
# Copyright (c) 2021-2022 THL A29 Limited
#
# This source code file is made available under MIT License
# See LICENSE for details
# ==============================================================================

"""
基础 接口路由
"""

from django.urls import path

from apps.base import apis

urlpatterns = [
    path("", apis.BaseApiView.as_view(), name="api_base_view"),
]
