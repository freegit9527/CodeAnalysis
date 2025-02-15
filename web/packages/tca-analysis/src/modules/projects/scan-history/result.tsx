// Copyright (c) 2021-2022 THL A29 Limited
//
// This source code file is made available under MIT License
// See LICENSE for details
// ==============================================================================

/**
 * 分析历史 - 分析结果
 */
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Drawer, Row, Col } from 'coding-oa-uikit';

import { getProjectRouter } from '@src/utils/getRoutePath';

import style from './style.scss';

interface ResultProps {
  data: any;
  visible: boolean;
  onClose: () => void;
}

const Result = (props: ResultProps) => {
  const { org_sid: orgSid, team_name: teamName, repoId, projectId } = useParams() as any;
  const { data, visible, onClose } = props;
  const { lintscan, cyclomaticcomplexityscan, duplicatescan, clocscan } = data;

  return (
        <Drawer
            title="分析结果"
            width={720}
            visible={visible}
            onClose={onClose}
            className={style.result}
        >
            <div className={style.module}>
                <h4>代码检查</h4>
                {lintscan ? (
                    <Row>
                        <Col span={8}>
                            <Link
                                onClick={onClose}
                                to={`${getProjectRouter(
                                  orgSid,
                                  teamName,
                                  repoId,
                                  projectId,
                                )}/codelint-issues?state=1&scan_open=${data.id}`}
                            >
                                新增问题 {lintscan.issue_open_num} 个（已聚合数据）
                            </Link>
                        </Col>
                        <Col span={8}>
                            <Link
                                onClick={onClose}
                                to={`${getProjectRouter(
                                  orgSid,
                                  teamName,
                                  repoId,
                                  projectId,
                                )}/codelint-issues?scan_fix=${data.id}`}
                            >
                                关闭问题 {lintscan.issue_fix_num} 个{' '}
                            </Link>
                        </Col>
                        <Col span={8}>原始问题总数 {lintscan.issue_detail_num} 个</Col>
                    </Row>
                ) : (
                    <p className={style.noData}>暂无数据</p>
                )}
            </div>
            <div className={style.module}>
                <h4>圈复杂度</h4>
                {cyclomaticcomplexityscan ? (
                    <Row>
                        <Col span={8}>
                            发现 {cyclomaticcomplexityscan.cc_open_num} 个高复杂度方法
                        </Col>
                        <Col span={8}>
                            <Link
                                onClick={onClose}
                                to={`${getProjectRouter(
                                  orgSid,
                                  teamName,
                                  repoId,
                                  projectId,
                                )}/metric/ccfiles?change_type=1,3`}
                            >
                                新增/变化 {cyclomaticcomplexityscan.diff_cc_num} 个高复杂度方法{' '}
                            </Link>
                        </Col>
                        <Col span={8}>
                            关闭 {cyclomaticcomplexityscan.cc_fix_num} 个高复杂度方法
                        </Col>
                    </Row>
                ) : (
                    <p className={style.noData}>暂无数据</p>
                )}
            </div>
            <div className={style.module}>
                <h4>重复代码</h4>
                {duplicatescan ? (
                    <>
                        <Row style={{ marginBottom: 8 }}>
                            <Col span={12}>总重复块数： {duplicatescan.duplicate_block_count} </Col>
                            <Col span={12}>
                                差异重复块数： {duplicatescan.diff_duplicate_block_count}{' '}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>总重复行数： {duplicatescan.duplicate_line_count} </Col>
                            <Col span={12}>
                                差异重复行数： {duplicatescan.diff_duplicate_line_count}{' '}
                            </Col>
                        </Row>
                    </>
                ) : (
                    <p className={style.noData}>暂无数据</p>
                )}
            </div>
            <div className={style.module}>
                <h4>代码统计</h4>
                {clocscan ? (
                    <>
                        <Row style={{ marginBottom: 8 }}>
                            <Col span={4}>统计方式 </Col>
                            <Col span={20}>代码行数 + 注释行数 + 空白行数 = 总行数 </Col>
                        </Row>
                        <Row style={{ marginBottom: 8 }}>
                            <Col span={4}>最新统计 </Col>
                            <Col span={20}>
                                {' '}
                                {clocscan.code_line_num} + {clocscan.comment_line_num} +{' '}
                                {clocscan.blank_line_num} = {clocscan.total_line_num}{' '}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>变更统计 </Col>
                            <Col span={20}>
                                <div>
                                    新增： {clocscan.add_code_line_num} +{' '}
                                    {clocscan.add_comment_line_num} + {clocscan.add_blank_line_num}{' '}
                                    = {clocscan.add_total_line_num}
                                </div>
                                <div>
                                    删除： {clocscan.del_code_line_num} +{' '}
                                    {clocscan.del_comment_line_num} + {clocscan.del_blank_line_num}{' '}
                                    = {clocscan.del_total_line_num}
                                </div>
                                <div>
                                    修改： {clocscan.mod_code_line_num} +{' '}
                                    {clocscan.mod_comment_line_num} + {clocscan.mod_blank_line_num}{' '}
                                    = {clocscan.mod_total_line_num}
                                </div>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <p className={style.noData}>暂无数据</p>
                )}
            </div>
        </Drawer>
  );
};

export default Result;
