			<div id = "game_mode" style = "float:left;">
				Game Mode : <b>Real Money</b> <br/>
				<button id="switchBt" href="#" >Switch</button>
			</div>
			<div id="user_info">
				<span class="info info_name">プレイヤー名:<b>abcc</b></span>
				<span class="info info_balance">所持金: <b>1.000.000</b></span>
<!-- 			   class="btn btn-red" -->
				<button id="logoutBt" href="#" >閉じる</button>
				
			</div>
			
			<div id="wrapper">
				<div id="wp-left">
					<div class="panel">
						<div class="panel-body">
							
							<div id="wp-btn">
<!-- 								<div class="buttons"> -->
<!-- 									<button href="#" class="btn btn-red">デモプレイ</button> -->
<!-- 									<button href="#" class="btn btn-red">リアルゲーム</button> -->

<!-- 								</div> -->
								<div class="clear"></div><!-- / .clear -->
							</div><!-- / #wp-btn -->

							<div class="form-horizontal" role="form">
								<div class="frm-left">
									
<!-- 									<div class="form-group"> -->
<!-- 										<label class="control control-label">ルームNo</label> -->
<!-- 										<input class="form-control" type="text" name="so_phong">     -->
<!-- 									</div> -->

<!-- 									<div class="form-group"> -->
<!-- 										<label class="control control-label">設定人数</label> -->
<!-- 										<select class="form-control input-small" name="max_user"> -->
<!-- 											<option value="1">1</option> -->
<!-- 											<option value="2">2</option> -->
<!-- 											<option value="3">3</option> -->
<!-- 											<option value="4">4</option> -->
<!-- 											<option value="5">5</option> -->
<!-- 											<option value="6">6</option> -->
<!-- 										</select>     -->
<!-- 									</div> -->

									<div class="form-group">
										<label class="control control-label">ルームオーナー</label>
										<input class="form-control" type="text" name="ten phong">    
									</div>
									<div class="form-group">
										<label class="control control-label">ルーム名</label>
										<input class="form-control" type="text" name="ten chu phong">    
									</div>
								</div><!-- / .frm-left -->

								<div class="frm-right">
									<div class="form-group">
										<label class="control control-label">開始ベット</label>
										<input class="form-control inputNum" type="text" name="bet-from">
										<span class="input-group-addon">$  &nbsp;   〜</span>
										<input class="form-control inputNum" type="text" name="bet-to">
										<span class="input-group-addon">$</span>
										 
									</div>

									<div class="form-group">
										<label class="control control-label">ルームデポジット</label>
										<input class="form-control inputNum" type="text" name="bet-from">
										<span class="input-group-addon">$   &nbsp;   〜</span>
										<input class="form-control inputNum" type="text" name="bet-to">
										<span class="input-group-addon">$</span> 
									</div>

								</div><!-- / .frm-right -->
								
								<div class="clear"></div><!-- / .clear -->

								<div class="buttons btn-action">
									<button class="btn btn-primary" type="submit">検索</button>
									<button class="btn btn-clear" type="reset">クリア</button>
								</div><!-- / .btn-action -->   

								<!-- table --> 
								<div id="wp-table" style="margin-left:28px;overflow: hidden; outline: none;">
									<div class="table-responsive">
									<table id= "tblRoom" class="table table-striped table-bordered table-hover">
										
												<tr>
<!-- 													<th> -->
<!-- 														 ルームNo -->
<!-- 													</th> -->
													<th>
														 ルーム名
													</th>
													<th>
														 ルームオーナー
													</th>
													<th>
														 開始ベット
													</th>
													<th>
														 ルームデポジット
													</th>
													<th>
														 プレイヤー数
													</th>
													<th>
														 ステータス
													</th>
													<th>
														入室
													</th>
													
												</tr>
											
										</table>
									</div>
								</div>
<!-- class="btn btn-primary btn-room" -->
								<button id = "createGameBt" type="button"  style="margin-top:5px;">ルーム作成</button>

								<div class="clear"></div><!-- / .clear -->
							</div>
						</div><!-- / .panel-body -->
					</div><!-- / .panel -->    
				</div><!-- / #wp-left -->

				<div id="wp-right">
					<div id="wp_chat">
<!-- 						<div id="wp_chat_info"> -->
						<div id="publicChatAreaPn" style="height: 460px;overflow: scroll;">						
						</div>

						<div id="wp_chat_control">
							<div class="form-horizontal" role="form">
								<div class="form-group">                                
									<div class="col-sm-11">
										<input  id="publicMsgIn" class="form-control" type="text"  name="name_phong" style="width:118px;">
<!-- 										class="btn btn-primary" -->
<!-- 										<button id="sendPublicMsgBt" type="button" >送信</button> -->
										<input type="button" id="sendPublicMsgBt" value="送信"/>
									</div>
									
								</div>    
							</div>        
						</div>

					</div><!-- / #wp_chat -->
				</div><!-- / #wp-right -->
			</div><!-- / #wrapper -->