DROP TABLE draft_picks;
DROP TABLE draft_teams;
DROP TABLE players;
DROP TABLE teams;
DROP TABLE league_settings;
DROP TABLE drafts;
DROP TABLE position_config;
DROP TABLE leagues;


CREATE TABLE leagues
(
id text NOT NULL, 
name text,
CONSTRAINT id_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

ALTER TABLE leagues
  OWNER TO postgres;

CREATE TABLE teams
(
id text NOT NULL,
name text,
slogan text,
league_id text,
owner text,
CONSTRAINT team_id_pk PRIMARY KEY (id),
CONSTRAINT league_id_fk FOREIGN KEY (league_id)
REFERENCES leagues (id) MATCH SIMPLE
  ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

ALTER TABLE teams
  OWNER TO postgres;


CREATE TABLE players
(
  id text NOT NULL,
  first_name text,
  last_name text,
  nfl_team text,
  "position" text,
  points integer,
  price integer,
  CONSTRAINT player_id_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE players
  OWNER TO postgres;

CREATE TABLE league_settings
(
  id text NOT NULL, -- 
  draft_budget integer,
  minimum_bid integer,
  roster_size integer,
  league_id text,
  CONSTRAINT league_settings_pk PRIMARY KEY (id),
  CONSTRAINT settings_league_id FOREIGN KEY (league_id)
      REFERENCES leagues (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE league_settings
  OWNER TO postgres;
COMMENT ON COLUMN league_settings.id IS '';

CREATE TABLE drafts
(
  id text NOT NULL,
  league_id text,
  year text,
  current_pick integer,
  status text,
  CONSTRAINT drafts_pk PRIMARY KEY (id),
  CONSTRAINT drafts_leagues_fk FOREIGN KEY (league_id)
      REFERENCES leagues (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE drafts
  OWNER TO postgres;

CREATE TABLE draft_teams
(
  id text NOT NULL,
  draft_id text,
  team_id text,
  remaining_budget integer,
  draft_spot text,
  CONSTRAINT draft_teams_pk PRIMARY KEY (id),
  CONSTRAINT draft_teams_draft_fk FOREIGN KEY (draft_id)
      REFERENCES drafts (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT draft_teams_team_id_fk FOREIGN KEY (team_id)
      REFERENCES teams (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE draft_teams
  OWNER TO postgres;

CREATE TABLE draft_picks
(
  id text NOT NULL,
  draft_id text,
  player_id text,
  draft_team_id text,
  price_paid integer,
  time_taken text,
  pick_number integer,
  CONSTRAINT draft_picks_pk PRIMARY KEY (id),
  CONSTRAINT draft_id_fk FOREIGN KEY (draft_id)
      REFERENCES drafts (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT draft_pick_player_fk FOREIGN KEY (player_id)
      REFERENCES players (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT draft_team_id_fk FOREIGN KEY (draft_team_id)
      REFERENCES draft_teams (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE draft_picks
  OWNER TO postgres;

CREATE TABLE position_config
(
  id text NOT NULL,
  league_id text,
  position text,
  CONSTRAINT position_config_pk PRIMARY KEY (id),
  CONSTRAINT league_id_fk FOREIGN KEY (league_id)
      REFERENCES leagues (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE position_config
  OWNER TO postgres;

insert into leagues values ('0','DFL');
insert into leagues values ('1','The League');
insert into teams values ('0','Eisenhowers Zombies','Regrets are for horseshoes and handbags.','0', 'Sager');
insert into teams values ('1','GD Smashers','Dumb','0', 'Gregg');
insert into teams values ('2','Disgruntled Trannies','Offensive','0', 'Jacob');
insert into teams values ('3','Pink Woodles','?','0', 'Tess');
insert into teams values ('4','TDs and Beer','Butt','0', 'Brent');
insert into teams values ('5','Jonahs Whales','Lame','0', 'Jonah');
insert into teams values ('6','Stormwind Paladins','No','0', 'Josh');
insert into teams values ('7','Long MarLa and the Packer','lol','0', 'MarLa');
insert into teams values ('8','Rumpleforeskin','Rumpled and up fore anything.','1', 'Sager');
insert into teams values ('9','Kevins','dd','1', 'Kevin');
insert into teams values ('10','Coreys','ff','1', 'Corey');
insert into teams values ('11','Shannons','ss','1', 'Shannon');
insert into teams values ('12','Belvins','aa','1', 'Belvin');
insert into teams values ('13','Nates','ee','1', 'Nate');
insert into teams values ('14','Nathans','44','1', 'Nathan');
insert into teams values ('15','Jamess','23','1', 'James');
insert into teams values ('16','Brooms','hf','1', 'Broom');
insert into teams values ('17','Jimmys','dsfg','1', 'Jimmy');
insert into teams values ('18','Pettys','sad','1', 'Petty');
insert into teams values ('19','Marks','gfdgd','1', 'Mark');

insert into drafts values ('0','0','2015','1','predraft');
insert into drafts values ('1','1','2015','1','predraft');

insert into league_settings values ('0','100','1','22','0');
insert into league_settings values ('1','200','1','15','1');

insert into draft_teams values ('0','0','0','100','1');
insert into draft_teams values ('1','0','1','100','2');
insert into draft_teams values ('2','0','2','100','3');
insert into draft_teams values ('3','0','3','100','4');
insert into draft_teams values ('4','0','4','100','5');
insert into draft_teams values ('5','0','5','100','6');
insert into draft_teams values ('6','0','6','100','7');
insert into draft_teams values ('7','0','7','100','8');
insert into draft_teams values ('8','1','8','200','1');
insert into draft_teams values ('9','1','9','200','2');
insert into draft_teams values ('10','1','10','200','3');
insert into draft_teams values ('11','1','11','200','4');
insert into draft_teams values ('12','1','12','200','5');
insert into draft_teams values ('13','1','13','200','6');
insert into draft_teams values ('14','1','14','200','7');
insert into draft_teams values ('15','1','15','200','8');
insert into draft_teams values ('16','1','16','200','9');
insert into draft_teams values ('17','1','17','200','10');
insert into draft_teams values ('18','1','18','200','11');
insert into draft_teams values ('19','1','19','200','12');

insert into players values ('1','Andrew','Luck','IND','QB',	'327',	'57');
insert into players values ('2','LeVeon','Bell','PIT','RB',	'299',	'56');
insert into players values ('3','Aaron','Rodgers','GB','QB',	'321',	'55');
insert into players values ('4','Matt','Forte','CHI','RB',	'285',	'51');
insert into players values ('5','Jamaal','Charles','KC','RB',	'282',	'49');
insert into players values ('6','Russell','Wilson','SEA','QB',	'300',	'47');
insert into players values ('7','Peyton','Manning','DEN','QB',	'298',	'46');
insert into players values ('8','Eddie','Lacy','GB','RB',	'273',	'46');
insert into players values ('9','Drew','Brees','NO','QB',	'295',	'45');
insert into players values ('10','Adrian','Peterson','MIN','RB',	'270',	'45');
insert into players values ('11','Marshawn','Lynch','SEA','RB',	'267',	'44');
insert into players values ('12','Antonio','Brown','PIT','WR',	'329',	'42');
insert into players values ('13','Rob','Gronkowski','NE','TE',	'248',	'41');
insert into players values ('14','Matt','Ryan','ATL','QB',	'283',	'40');
insert into players values ('15','CJ','Anderson','DEN','RB',	'254',	'39');
insert into players values ('16','Cam','Newton','CAR','QB',	'273',	'37');
insert into players values ('17','Demaryius','Thomas','DEN','WR',	'310',	'36');
insert into players values ('18','Ben','Roethlisberger','PIT','QB',	'268',	'35');
insert into players values ('19','Tony','Romo','DAL','QB',	'268',	'35');
insert into players values ('20','Matthew','Stafford','DET','QB',	'266',	'34');
insert into players values ('21','Ryan','Tannehill','MIA','QB',	'263',	'33');
insert into players values ('22','Odell','Beckham','NYG','WR',	'301',	'33');
insert into players values ('23','Philip','Rivers','SD','QB',	'258',	'31');
insert into players values ('24','Justin','Forsett','BAL','RB',	'234',	'31');
insert into players values ('25','DeMarco','Murray','PHI','RB',	'233',	'31');
insert into players values ('26','Julio','Jones','ATL','WR',	'294',	'31');
insert into players values ('27','Eli','Manning','NYG','QB',	'254',	'30');
insert into players values ('28','Colin','Kaepernick','SF','QB',	'251',	'29');
insert into players values ('29','LeSean','McCoy','BUF','RB',	'228',	'29');
insert into players values ('30','Dez','Bryant','DAL','WR',	'288',	'29');
insert into players values ('31','Tom','Brady','NE','QB',	'248',	'28');
insert into players values ('32','Joe','Flacco','BAL','QB',	'244',	'27');
insert into players values ('33','Jay','Cutler','CHI','QB',	'243',	'27');
insert into players values ('34','Jeremy','Hill','CIN','RB',	'222',	'27');
insert into players values ('35','Teddy','Bridgewater','MIN','QB',	'239',	'26');
insert into players values ('36','Randall','Cobb','GB','WR',	'279',	'26');
insert into players values ('37','Calvin','Johnson','DET','WR',	'277',	'26');
insert into players values ('38','Carson','Palmer','ARI','QB',	'233',	'24');
insert into players values ('39','Sam','Bradford','PHI','QB',	'232',	'24');
insert into players values ('40','Lamar','Miller','MIA','RB',	'215',	'24');
insert into players values ('41','Jimmy','Graham','SEA','TE',	'203',	'24');
insert into players values ('42','Alex','Smith','KC','QB',	'230',	'23');
insert into players values ('43','AJ','Green','CIN','WR',	'270',	'23');
insert into players values ('44','Andy','Dalton','CIN','QB',	'221',	'21');
insert into players values ('45','Greg','Olsen','CAR','TE',	'195',	'21');
insert into players values ('46','Marcus','Mariota','TEN','QB',	'220',	'20');
insert into players values ('47','Andre','Ellington','ARI','RB',	'199',	'20');
insert into players values ('48','Mark','Ingram','NO','RB',	'197',	'20');
insert into players values ('49','Jameis','Winston','TB','QB',	'215',	'19');
insert into players values ('50','Frank','Gore','IND','RB',	'197',	'19');
insert into players values ('51','Melvin','Gordon','SD','RB',	'196',	'19');
insert into players values ('52','Latavius','Murray','OAK','RB',	'194',	'19');
insert into players values ('53','Alshon','Jeffery','CHI','WR',	'257',	'19');
insert into players values ('54','Travis','Kelce','KC','TE',	'190',	'19');
insert into players values ('55','Blake','Bortles','JAC','QB',	'207',	'18');
insert into players values ('56','Martellus','Bennett','CHI','TE',	'188',	'18');
insert into players values ('57','Derek','Carr','OAK','QB',	'205',	'17');
insert into players values ('58','Nick','Foles','STL','QB',	'205',	'17');
insert into players values ('59','Robert','Griffin','WAS','QB',	'204',	'17');
insert into players values ('60','TY','Hilton','IND','WR',	'249',	'17');
insert into players values ('61','Alfred','Morris','WAS','RB',	'186',	'16');
insert into players values ('62','Carlos','Hyde','SF','RB',	'186',	'16');
insert into players values ('63','Mike','Evans','TB','WR',	'246',	'16');
insert into players values ('64','Emmanuel','Sanders','DEN','WR',	'243',	'15');
insert into players values ('65','TJ','Yeldon','JAC','RB',	'179',	'14');
insert into players values ('66','CJ','Spiller','NO','RB',	'178',	'14');
insert into players values ('67','Giovani','Bernard','CIN','RB',	'178',	'14');
insert into players values ('68','Brandin','Cooks','NO','WR',	'237',	'14');
insert into players values ('69','Jonathan','Stewart','CAR','RB',	'176',	'13');
insert into players values ('70','Julian','Edelman','NE','WR',	'236',	'13');
insert into players values ('71','Jason','Witten','DAL','TE',	'172',	'13');
insert into players values ('72','Joique','Bell','DET','RB',	'169',	'12');
insert into players values ('73','DeAndre','Hopkins','HOU','WR',	'230',	'12');
insert into players values ('74','Rashad','Jennings','NYG','RB',	'168',	'11');
insert into players values ('75','Joseph','Randle','DAL','RB',	'167',	'11');
insert into players values ('76','Ameer','Abdullah','DET','RB',	'164',	'11');
insert into players values ('77','Devonta','Freeman','ATL','RB',	'162',	'10');
insert into players values ('78','Arian','Foster','HOU','RB',	'161',	'10');
insert into players values ('79','Julius','Thomas','JAC','TE',	'164',	'10');
insert into players values ('80','Josh','McCown','CLE','QB',	'163',	'9');
insert into players values ('81','Todd','Gurley','STL','RB',	'157',	'9');
insert into players values ('82','Tevin','Coleman','ATL','RB',	'157',	'9');
insert into players values ('83','LeGarrette','Blount','NE','RB',	'154',	'9');
insert into players values ('84','Jordan','Matthews','PHI','WR',	'218',	'9');
insert into players values ('85','Golden','Tate','DET','WR',	'217',	'9');
insert into players values ('86','Chris','Ivory','NYJ','RB',	'151',	'8');
insert into players values ('87','Shane','Vereen','NYG','RB',	'148',	'8');
insert into players values ('88','Andre','Johnson','IND','WR',	'215',	'8');
insert into players values ('89','Keenan','Allen','SD','WR',	'214',	'8');
insert into players values ('90','Isaiah','Crowell','CLE','RB',	'146',	'7');
insert into players values ('91','Zach','Ertz','PHI','TE',	'151',	'7');
insert into players values ('92','Doug','Martin','TB','RB',	'137',	'6');
insert into players values ('93','DeSean','Jackson','WAS','WR',	'206',	'6');
insert into players values ('94','Jarvis','Landry','MIA','WR',	'204',	'6');
insert into players values ('95','Davante','Adams','GB','WR',	'203',	'6');
insert into players values ('96','Delanie','Walker','TEN','TE',	'147',	'6');
insert into players values ('97','Brian','Hoyer','HOU','QB',	'141',	'5');
insert into players values ('98','Ryan','Fitzpatrick','NYJ','QB',	'140',	'5');
insert into players values ('99','Danny','Woodhead','SD','RB',	'132',	'5');
insert into players values ('100','Charles','Sims','TB','RB',	'127',	'5');
insert into players values ('101','Brandon','Marshall','NYJ','WR',	'202',	'5');
insert into players values ('102','Sammy','Watkins','BUF','WR',	'201',	'5');
insert into players values ('103','Jeremy','Maclin','KC','WR',	'201',	'5');
insert into players values ('104','Ryan','Mathews','PHI','RB',	'122',	'4');
insert into players values ('105','Bishop','Sankey','TEN','RB',	'121',	'4');
insert into players values ('106','Reggie','Bush','SF','RB',	'119',	'4');
insert into players values ('107','Darren','Sproles','PHI','RB',	'116',	'4');
insert into players values ('108','Alfred','Blue','HOU','RB',	'116',	'4');
insert into players values ('109','Vincent','Jackson','TB','WR',	'192',	'4');
insert into players values ('110','Amari','Cooper','OAK','WR',	'191',	'4');
insert into players values ('111','Allen','Robinson','JAC','WR',	'191',	'4');
insert into players values ('112','Roddy','White','ATL','WR',	'190',	'4');
insert into players values ('113','Anquan','Boldin','SF','WR',	'190',	'4');
insert into players values ('114','Jordan','Reed','WAS','TE',	'140',	'4');
insert into players values ('115','Jordan','Cameron','MIA','TE',	'140',	'4');
insert into players values ('116','Tre','Mason','STL','RB',	'115',	'3');
insert into players values ('117','Roy','Helu','OAK','RB',	'112',	'3');
insert into players values ('118','Steve','Smith','BAL','WR',	'188',	'3');
insert into players values ('119','Eric','Decker','NYJ','WR',	'187',	'3');
insert into players values ('120','Heath','Miller','PIT','TE',	'138',	'3');
insert into players values ('121','Kyle','Rudolph','MIN','TE',	'138',	'3');
insert into players values ('122','Duke','Johnson','CLE','RB',	'103',	'2');
insert into players values ('123','Darren','McFadden','DAL','RB',	'96',	'2');
insert into players values ('124','Denard','Robinson','JAC','RB',	'95',	'2');
insert into players values ('125','Lance','Dunbar','DAL','RB',	'94',	'2');
insert into players values ('126','Larry','Fitzgerald','ARI','WR',	'182',	'2');
insert into players values ('127','Mike','Wallace','MIN','WR',	'181',	'2');
insert into players values ('128','Kendall','Wright','TEN','WR',	'177',	'2');
insert into players values ('129','Owen','Daniels','DEN','TE',	'134',	'2');
insert into players values ('130','Buffalo','Bills','Buf','DST',	'137',	'2');
insert into players values ('131','Houston','Texans','Hou','DST',	'135',	'2');
insert into players values ('132','Philadelphia','Eagles','Phi','DST',	'135',	'2');
insert into players values ('133','Carolina','Panthers','Car','DST',	'133',	'2');
insert into players values ('134','Seattle','Seahawks','Sea','DST',	'131',	'2');
insert into players values ('135','Matt','Cassel','BUF','QB',	'97',	'1');
insert into players values ('136','Tyrod','Taylor','BUF','QB',	'90',	'1');
insert into players values ('137','Geno','Smith','NYJ','QB',	'85',	'1');
insert into players values ('138','Ryan','Mallett','HOU','QB',	'59',	'1');
insert into players values ('139','Jimmy','Garoppolo','NE','QB',	'54',	'1');
insert into players values ('140','Johnny','Manziel','CLE','QB',	'32',	'1');
insert into players values ('141','Kirk','Cousins','WAS','QB',	'31',	'1');
insert into players values ('142','Knile','Davis','KC','RB',	'93',	'1');
insert into players values ('143','Lorenzo','Taliaferro','BAL','RB',	'92',	'1');
insert into players values ('144','Matt','Jones','WAS','RB',	'92',	'1');
insert into players values ('145','David','Cobb','TEN','RB',	'91',	'1');
insert into players values ('146','Dexter','McCluster','TEN','RB',	'91',	'1');
insert into players values ('147','Fred','Jackson','BUF','RB',	'89',	'1');
insert into players values ('148','Dan','Herron','IND','RB',	'88',	'1');
insert into players values ('149','Brandon','LaFell','NE','WR',	'176',	'1');
insert into players values ('150','Nelson','Agholor','PHI','WR',	'175',	'1');
insert into players values ('151','Pierre','Garcon','WAS','WR',	'175',	'1');
insert into players values ('152','Charles','Johnson','MIN','WR',	'174',	'1');
insert into players values ('153','Victor','Cruz','NYG','WR',	'173',	'1');
insert into players values ('154','Michael','Floyd','ARI','WR',	'170',	'1');
insert into players values ('155','Dwayne','Allen','IND','TE',	'130',	'1');
insert into players values ('156','Coby','Fleener','IND','TE',	'130',	'1');
insert into players values ('157','Tyler','Eifert','CIN','TE',	'130',	'1');
insert into players values ('158','Antonio','Gates','SD','TE',	'128',	'1');
insert into players values ('159','Austin','Seferian-Jenkins','TB','TE',	'127',	'1');
insert into players values ('160','St Louis','Rams','StL','DST',	'127',	'1');
insert into players values ('161','New England','Patriots','NE','DST',	'123',	'1');
insert into players values ('162','Miami','Dolphins','Mia','DST',	'122',	'1');
insert into players values ('163','Arizona','Cardinals','Ari','DST',	'121',	'1');
insert into players values ('164','Indianapolis','Colts','Ind','DST',	'121',	'1');
insert into players values ('165','Baltimore','Ravens','Bal','DST',	'121',	'1');
insert into players values ('166','Tampa Bay','Buccaneers','TB','DST',	'119',	'1');
insert into players values ('167','Stephen','Gostkowski','NE','K',	'136',	'1');
insert into players values ('168','Justin','Tucker','BAL','K',	'130',	'1');
insert into players values ('169','Connor','Barth','','K',	'129',	'1');
insert into players values ('170','Steven','Hauschka','SEA','K',	'129',	'1');
insert into players values ('171','Mason','Crosby','GB','K',	'129',	'1');
insert into players values ('172','Cody','Parkey','PHI','K',	'128',	'1');
insert into players values ('173','Adam','Vinatieri','IND','K',	'127',	'1');
insert into players values ('174','Shayne','Graham','','K',	'126',	'1');
insert into players values ('175','Dan','Bailey','DAL','K',	'124',	'1');
insert into players values ('176','Shaun','Suisham','PIT','K',	'123',	'1');
insert into players values ('177','Matt','Bryant','ATL','K',	'122',	'1');
insert into players values ('178','Garrett','Hartley','','K',	'120',	'1');

insert into position_config values ('0','1','QB');
insert into position_config values ('1','1','WR');
insert into position_config values ('2','1','WR');
insert into position_config values ('3','1','RB');
insert into position_config values ('4','1','RB');
insert into position_config values ('5','1','QB');
insert into position_config values ('6','1','TE');
insert into position_config values ('7','1','DST');
insert into position_config values ('8','1','K');